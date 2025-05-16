📄 MiCine – Backend

📌 Descripción
    MiCine Backend es una API RESTful construida con Node.js y Express, conectada a MongoDB Atlas, que permite gestionar usuarios, autenticación, perfiles y un CRUD de películas.

🎯 Objetivo
    Demostrar la construcción de un servidor completo con:
        🔐 Autenticación JWT
        📂 Modelos MongoDB (User, Profile, Movie)
        🛣️ Rutas protegidas con middleware
        🔄 Operaciones CRUD sobre múltiples colecciones
        ✅ Validaciones con Mongoose y manejo de errores
        📈 Separación de capas (controllers, routes, models)

🚀 Funcionalidades
    Autenticación
        POST /api/auth/register → registrar usuario
        POST /api/auth/login → iniciar sesión (JWT)

    Usuarios (solo admin)
        GET /api/users
        POST /api/users
        PUT /api/users/:id
        DELETE /api/users/:id

    Perfiles
        GET /api/profiles
        POST /api/profiles
        PUT /api/profiles/:id
        DELETE /api/profiles/:id

    Películas (CRUD admin)
        GET /api/movies/crud
        POST /api/movies/crud
        PUT /api/movies/crud/:id
        DELETE /api/movies/crud/:id

    Géneros
        GET /api/admin/genres → lista estática de géneros TMDb
        GET /api/genres → géneros únicos extraídos de la colección Movie

    Feedback & Seguridad
        Manejo de errores HTTP
        SweetAlert2 / Toasts en frontend
        CORS, logging con morgan

🛠 Tecnologías
    Node.js, Express
    MongoDB Atlas, Mongoose
    dotenv para variables de entorno
    jsonwebtoken, bcryptjs
    cors, morgan
    nodemon (dev)

📂 Estructura
    backend/
    ├─ src/
    │  ├─ controllers/     # lógica de negocios
    │  ├─ middleware/      # auth, error handler
    │  ├─ models/          # esquemas Mongoose
    │  ├─ routes/          # definición de endpoints
    │  ├─ app.js           # configuración de Express
    │  └─ server.js        # arranque del servidor
    ├─ .env                # PORT, MONGO_URI, JWT_SECRET, TMDB_API_KEY
    └─ package.json        # scripts & dependencias

Instalar dependencias:
    npm install

Configurar variables en .env:
    PORT=4000
    MONGO_URI=<tu_mongo_uri>
    JWT_SECRET=<un_secreto>
    TMDB_API_KEY=<tu_tmdb_api_key>  # opcional para /admin/genres

Levantar en modo desarrollo:
    npm run dev

La API estará en http://localhost:4000/api

🔗 Deploy & Repositorio
github: https://github.com/jorgevaleri/trabajoFinalNodo-Backend

Render: https://trabajofinalnodo-backend.onrender.com

✅ Criterios cumplidos
    ✔ Autenticación y autorización
    ✔ CRUD completo con validaciones
    ✔ Manejo de errores
    ✔ Código modular y documentado