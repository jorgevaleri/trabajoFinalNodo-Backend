// backend/src/routes/movieCrudRoutes.js
// IMPORTA EL MÉTODO Router
import { Router } from 'express'
// IMPORTA LOS MIDDLEWARES authenticate Y authorizeAdmin PARA PROTEGER RUTAS
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js'
// IMPORTA LAS FUNCIONES DEL CONTROLADOR movieCrudController PARA GESTIÓN DE PELÍCULAS Y GÉNEROS
import {
  getAllGenres,
  createMovieCrud,
  listMoviesCrud,
  getMovieCrud,
  updateMovieCrud,
  deleteMovieCrud
} from '../controllers/movieCrudController.js'

// CREA UNA NUEVA INSTANCIA DE ROUTER PARA AGRUPAR RUTAS DE ADMINISTRACIÓN DE PELÍCULAS
const router = Router()

// APLICA authenticate Y authorizeAdmin A TODAS LAS RUTAS DE ESTE ROUTER
router.use(authenticate, authorizeAdmin)

// DEFINE ENDPOINT GET /genres PARA OBTENER LA LISTA DE GÉNEROS DISPONIBLES
router.get('/genres', getAllGenres)

// CRUD PELICULAS
router.post('/',    createMovieCrud) // DEFINE ENDPOINT POST / PARA CREAR UNA NUEVA PELÍCULA
router.get('/',     listMoviesCrud) // DEFINE ENDPOINT GET / PARA LISTAR PELÍCULAS CON FILTROS Y ORDEN
router.get('/:id',  getMovieCrud) // DEFINE ENDPOINT GET /:id PARA OBTENER LOS DETALLES DE UNA PELÍCULA POR ID
router.put('/:id',  updateMovieCrud) // DEFINE ENDPOINT PUT /:id PARA ACTUALIZAR UNA PELÍCULA EXISTENTE
router.delete('/:id', deleteMovieCrud) // DEFINE ENDPOINT DELETE /:id PARA ELIMINAR UNA PELÍCULA

// EXPORTA EL ROUTER CONFIGURADO PARA SU USO EN LA APLICACIÓN PRINCIPAL
export default router
