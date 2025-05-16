// backend/src/routes/genreRoutes.js
// IMPORTA EL MÉTODO Router DESDE EXPRESS PARA DEFINIR RUTAS
import { Router }        from 'express'
// IMPORTA LA FUNCIÓN listGenres DESDE EL CONTROLADOR genreController
import { listGenres }    from '../controllers/genreController.js'
// IMPORTA EL MIDDLEWARE authenticate PARA PROTEGER LAS RUTAS
import { authenticate }  from '../middleware/authMiddleware.js'

// CREA UNA NUEVA INSTANCIA DE ROUTER PARA AGRUPAR RUTAS DE GÉNEROS
const router = Router()

// APLICA EL MIDDLEWARE authenticate A TODAS LAS RUTAS DEFINIDAS EN ESTE ROUTER
router.use(authenticate)

// DEFINE LA RUTA GET /api/genres QUE USA listGenres PARA RESPONDER CON LA LISTA DE GÉNEROS
router.get('/', listGenres)

// EXPORTA EL ROUTER CONFIGURADO PARA SU USO EN LA APLICACIÓN PRINCIPAL
export default router
