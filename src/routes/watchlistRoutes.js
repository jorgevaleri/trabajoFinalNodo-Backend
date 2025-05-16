//backend/src/routes/watchlistRoutes.js
//IMPORTA ROUTER DE EXPRESS PARA CREAR RUTAS
import { Router } from 'express'

//IMPORTAR LOS CONTROLADORES CORRESPONDIENTES A LA WATCHLIST
import {
  getWatchlist, //OBTIENE LA LISTA DE PELICULAS GUARDADAS EN UN PERFIL
  addToWatchlist, //AGREGA UNA PELICULA A LA WATCHLIST
  removeFromWatchlist //ELIMINA UNA PELICULA DE LA WATCHLIST
} from '../controllers/watchlistController.js'

//MIDDLEWARE PARA AUTENTICAR AL USUARIO ANTES DE ACCEDER A CUALQUIER RUTA
import { authenticate } from '../middleware/authMiddleware.js'

//CREA UNA INSTANCIA DEL ENRUTADOR
const router = Router()

//APLICA EL MIDDLEWARE DE AUTENTICACION A TODAS LAS RUTAS DE ESTE ROUTER
router.use(authenticate)

//RUTA GET PARA OBTENER LA WATCHLIST DE UN PERFIL ESPECIFICO
router.get('/', getWatchlist)

//RUTA POST PARA AGREGAR UNA PELICULA A LA WATCHLIST
router.post('/', addToWatchlist)

//RUTA DELETE PARA ELIMINAR UNA PELICULA DE LA WATCHLIST SEGUN EL profileId Y movieId
router.delete('/:profileId/:movieId', removeFromWatchlist)

export default router
