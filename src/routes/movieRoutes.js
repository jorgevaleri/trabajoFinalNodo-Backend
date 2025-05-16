// backend/src/routes/movieRoutes.js
// IMPORTA EL MÉTODO ROUTER DESDE EXPRESS
import { Router } from 'express'
// IMPORTA EL MIDDLEWARE authenticate PARA PROTEGER LAS RUTAS
import { authenticate } from '../middleware/authMiddleware.js'
// IMPORTA LAS FUNCIONES listMovies Y getMovieById DESDE EL CONTROLADOR movieController
import { listMovies, getMovieById } from '../controllers/movieController.js'

// CREA UNA INSTANCIA DE ROUTER PARA DEFINIR LAS RUTAS DE PELÍCULAS
const router = Router()

// APLICA EL MIDDLEWARE authenticate A TODAS LAS RUTAS DE ESTE ROUTER
router.use(authenticate)

// DEFINE LA RUTA GET / PARA LISTAR PELÍCULAS UTILIZANDO listMovies
router.get('/', listMovies)

// DEFINE LA RUTA GET /:id PARA OBTENER LOS DETALLES DE UNA PELÍCULA ESPECÍFICA
router.get('/:id', getMovieById)

// EXPORTA EL ROUTER CONFIGURADO PARA SU USO EN LA APLICACIÓN PRINCIPAL
export default router
