# minimal-habits-tracker

Aplicación de seguimiento de hábitos con almacenamiento local. Desarrollada para practicar integración de Backend y Frontend.

## Tecnologías

### Backend
    - `Node.js` 
    - `Sqlite`
    - `Express`

### Frontend 
    - `React`
    - `Tailwindcss`

## Ejecutar el proyecto

Backend:

```bash
cd backend
npm install
npm start
```

Frontend, in another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

Open `http://localhost:5173`. The API is available at `http://localhost:3000`, and the SQLite database is persisted in the `backend_data` Docker volume.

Stop the services with:

```bash
docker compose down
```

To remove the persisted database as well:

```bash
docker compose down -v
```

## Características
    - Registro visual de hábitos mediante mapa de actividad al estilo GitHub.
    - Operaciones CRUD completas (Crear, Leer, Actualizar y Eliminar hábitos).
    - Persistencia local en SQLite mediante una API REST.
    - Interfaz limpia e intuitiva inspirada en el diseño de Binance.

## Proceso de Desarrollo

### Vibe code de Frontend
Diseñé inicialmente los wireframes en papel. Luego compartí los bocetos a Claude junto con referencias visuales (interfaz de Binance) y funcionales (mapa de actividad de GitHub). Especifiqué el stack técnico (React, Tailwind CSS y Vite) para generar el diseño de los componentes y la estructura base.

### Codeo de Backend
Comencé la estructura desde cero para vincular la lógica con la interfaz previa. Definí el modelo de datos para gestionar el ciclo de vida de los hábitos (CRUD). Elegí SQLite como base de datos local pensando en una futura migración a dispositivos móviles. Para esta primera iteración se priorizó la simplicidad funcional, omitiendo capas como Helmet, JWT o encriptación.

### Integración de Frontend y Backend
Conecté los componentes de React con los endpoints de la API de Express mediante peticiones HTTP, validando la persistencia de los datos en la base de datos local y sincronizando la interfaz en tiempo real.

## Imagen