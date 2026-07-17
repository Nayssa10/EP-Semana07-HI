const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQL Server Configuration
const dbConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'YourStrong@Pass123',
    server: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false, // For local Docker containers, false is recommended
        trustServerCertificate: true // Crucial for trusting developer/Docker certificates
    }
};

let poolConnection;

// Wait for SQL Server to boot up and initialize database + tables
async function initializeDatabase() {
    let connected = false;
    let attempts = 0;
    const maxAttempts = 15;

    while (!connected && attempts < maxAttempts) {
        try {
            attempts++;
            console.log(`[Database] Attempting connection to SQL Server (Attempt ${attempts}/${maxAttempts})...`);
            
            // Connect to master database first to check/create our database
            const masterConfig = { ...dbConfig, database: 'master' };
            const masterPool = await sql.connect(masterConfig);
            
            console.log('[Database] Connected to SQL Server master successfully.');
            
            // Create WeatherDB if it does not exist
            await masterPool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'WeatherDB')
                BEGIN
                    CREATE DATABASE WeatherDB;
                    PRINT 'Database WeatherDB created.';
                END
            `);
            
            await masterPool.close();
            console.log("[Database] WeatherDB verified/created.");

            // Now connect directly to WeatherDB
            const weatherConfig = { ...dbConfig, database: 'WeatherDB' };
            poolConnection = await sql.connect(weatherConfig);
            connected = true;
            console.log('[Database] Connected to WeatherDB database successfully.');

            // Check and create table
            await poolConnection.request().query(`
                IF OBJECT_ID('WeatherLogs', 'U') IS NULL
                BEGIN
                    CREATE TABLE WeatherLogs (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        latitude VARCHAR(50) NOT NULL,
                        longitude VARCHAR(50) NOT NULL,
                        temperature FLOAT NOT NULL,
                        wind_speed FLOAT NOT NULL,
                        humidity FLOAT,
                        search_time DATETIME DEFAULT GETDATE()
                    );
                    PRINT 'Table WeatherLogs created.';
                END
            `);
            console.log("[Database] WeatherLogs table verified/created.");

        } catch (err) {
            console.error(`[Database] Connection failure on attempt ${attempts}:`, err.message);
            if (attempts >= maxAttempts) {
                console.error('[Database] Critical: Maximum connection attempts reached. Exiting.');
                process.exit(1);
            }
            // Wait 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

// Routes

// 1. Healthcheck Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', databaseConnected: !!poolConnection });
});

// 2. Save Weather Search Log
app.post('/api/weather-logs', async (req, res) => {
    const { latitude, longitude, temperature, wind_speed, humidity } = req.body;

    // Validation
    if (latitude === undefined || longitude === undefined || temperature === undefined || wind_speed === undefined) {
        return res.status(400).json({ error: 'Missing required parameters: latitude, longitude, temperature, wind_speed' });
    }

    try {
        const request = poolConnection.request();
        
        request.input('latitude', sql.VarChar(50), String(latitude));
        request.input('longitude', sql.VarChar(50), String(longitude));
        request.input('temperature', sql.Float, parseFloat(temperature));
        request.input('wind_speed', sql.Float, parseFloat(wind_speed));
        request.input('humidity', sql.Float, humidity !== null && humidity !== undefined ? parseFloat(humidity) : null);

        await request.query(`
            INSERT INTO WeatherLogs (latitude, longitude, temperature, wind_speed, humidity)
            VALUES (@latitude, @longitude, @temperature, @wind_speed, @humidity)
        `);

        res.status(201).json({ message: 'Weather search log saved successfully' });
    } catch (err) {
        console.error('[API] Error saving weather log:', err);
        res.status(500).json({ error: 'Database insertion error', details: err.message });
    }
});

// 3. Retrieve Latest Weather Search Logs
app.get('/api/weather-logs', async (req, res) => {
    try {
        const result = await poolConnection.request().query(`
            SELECT TOP 20 id, latitude, longitude, temperature, wind_speed, humidity, search_time
            FROM WeatherLogs
            ORDER BY search_time DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('[API] Error retrieving weather logs:', err);
        res.status(500).json({ error: 'Database selection error', details: err.message });
    }
});

// Start initialization and server
initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`[Server] Backend application running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('[Server] Failed to initialize application:', err);
    process.exit(1);
});
