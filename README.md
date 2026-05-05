# EP-Semana07-HI: Aplicacion del Clima (Meteoro)

Este proyecto consiste en una aplicacion web desarrollada en React utilizando Vite. Su objetivo principal es consultar y mostrar informacion del clima en tiempo real basandose en las coordenadas geograficas (latitud y longitud) proporcionadas por el usuario.

## Caracteristicas Principales
- **Busqueda por Coordenadas**: Permite consultar el clima de cualquier ubicacion introduciendo su latitud y longitud.
- **Clima Actual**: Despliega detalles en vivo de la temperatura y la velocidad del viento.
- **Pronostico a Corto Plazo**: Muestra un listado del pronostico para las proximas 5 horas (hora, temperatura y humedad relativa).
- **Actualizacion Rapida**: Cuenta con un boton interno para refrescar los datos sin recargar la pagina.
- **Manejo de Estados**: Controla de modo seguro los tiempos de carga y los posibles errores durante la consulta a la API de clima.

## Estructura del Codigo
Dentro del directorio `Meteoro/src`, el codigo se divide en las siguientes secciones clave:
- `components/WeatherApp.jsx`: Componente principal que define la interfaz de usuario, contiene el formulario e incluye la visualizacion de datos.
- `hooks/useWeather.jsx`: Hook personalizado de React para aislar la logica de estado y orquestar las peticiones.
- `api_weather/weatherService.jsx`: Encargado de empaquetar la logica directa de comunicacion con el proveedor del clima.

## Tecnologias Usadas
- React (Hooks: useState).
- JavaScript.
- CSS estandar para el diseño.
- Vite como entorno principal y de construccion.

## Instrucciones para su Ejecucion Local
1. Abre tu terminal y muevete al directorio base de la aplicacion:
   ```bash
   cd Meteoro
   ```
2. Instala las dependencias necesarias de node:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Navega a la direccion local proporcionada en la terminal para visualizar la aplicacion web.
