//backend/src/index.js
// IMPORTA LA LIBRERÍA dotenv PARA CARGAR VARIABLES DE ENTORNO DESDE UN ARCHIVO .env
import dotenv from 'dotenv'
// IMPORTA EXPRESS, EL FRAMEWORK DE SERVIDOR PARA NODE.JS
import express from 'express'
// IMPORTA EL MÓDULO path PARA MANEJO DE RUTAS DE ARCHIVOS
import path from 'path'
// IMPORTA cors PARA HABILITAR SOLICITUDES DESDE OTROS DOMINIOS (CORS)
import cors from 'cors'
// IMPORTA express-async-errors PARA CAPTURAR ERRORES EN FUNCIONES async SIN try-catch
import 'express-async-errors'
// IMPORTA LA FUNCIÓN connectDB PARA CONECTARSE A LA BASE DE DATOS
import { connectDB } from './config/db.js'

import authRoutes from './routes/authRoutes.js' // IMPORTA LAS RUTAS DE AUTENTICACIÓN
import userRoutes from './routes/userRoutes.js' // IMPORTA LAS RUTAS DE USUARIOS
import profileRoutes from './routes/profileRoutes.js' // IMPORTA LAS RUTAS DE PERFILES
import genreRoutes from './routes/genreRoutes.js' // IMPORTA LAS RUTAS DE GÉNEROS

import movieCrudRoutes from './routes/movieCrudRoutes.js' // IMPORTA LAS RUTAS CRUD DE PELÍCULAS (ADMIN)
import movieRoutes from './routes/movieRoutes.js' // IMPORTA LAS RUTAS DE PELÍCULAS PARA TODOS LOS USUARIOS
import watchlistRoutes from './routes/watchlistRoutes.js' // IMPORTA LAS RUTAS DE LISTA DE SEGUIMIENTO (WATCHLIST)

// CARGA LAS VARIABLES DE ENTORNO DESDE EL ARCHIVO .env
dotenv.config()
// CREA UNA INSTANCIA DE LA APLICACIÓN EXPRESS
const app = express()

// HABILITA CORS PARA PERMITIR ACCESO DESDE CLIENTES EXTERNOS
app.use(cors())
// PERMITE A EXPRESS PARSEAR CUERPOS EN FORMATO JSON
app.use(express.json())

// SIRVE ARCHIVOS ESTÁTICOS DESDE LA CARPETA DE IMÁGENES DE PERFIL
app.use(
  '/profile-images',
  express.static(path.join(process.cwd(), 'public', 'profile-images'))
)

// CONECTA A LA BASE DE DATOS USANDO LA FUNCIÓN ASÍNCRONA connectDB
await connectDB()

// MONTA LAS DIFERENTES RUTAS BAJO LOS PREFIJOS CORRESPONDIENTES

/***********************************/
/*NUEVO*/
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de películas');
});
/***********************************/


app.use('/api/auth', authRoutes) // RUTAS DE AUTENTICACIÓN
app.use('/api/users', userRoutes) // RUTAS DE USUARIOS
app.use('/api/profiles', profileRoutes) // RUTAS DE PERFILES
app.use('/api/genres', genreRoutes) // RUTAS DE GÉNEROS

app.use('/api/movies/crud', movieCrudRoutes) // RUTAS CRUD DE PELÍCULAS (ADMIN)
app.use('/api/movies', movieRoutes) // RUTAS DE CONSULTA DE PELÍCULAS
app.use('/api/watchlist', watchlistRoutes) // RUTAS DE WATCHLIST

// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
app.use((err, req, res, next) => {
  console.error(err) // MUESTRA EL ERROR EN LA CONSOLA
  res.status(500).json({ message: 'Error interno' }) // RESPUESTA DE ERROR GENERAL
})

// DEFINE EL PUERTO EN EL QUE ESCUCHA EL SERVIDOR (DE .env O 4000 POR DEFECTO)
const PORT = process.env.PORT || 4000
// INICIA EL SERVIDOR Y MUESTRA UN MENSAJE EN CONSOLA
app.listen(PORT, () => console.log(`Server on ${PORT}`))
