// backend/src/routes/authRoutes.js
// IMPORTA EL MÉTODO Router DESDE EXPRESS PARA DEFINIR RUTAS
import { Router } from 'express'
// IMPORTA LAS FUNCIONES register, login Y me DESDE authController
import { register, login, me } from '../controllers/authController.js'
// IMPORTA EL MIDDLEWARE authenticate PARA PROTEGER RUTAS QUE REQUIEREN AUTENTICACIÓN
import { authenticate } from '../middleware/authMiddleware.js'

// CREA UNA NUEVA INSTANCIA DE ROUTER PARA AGRUPAR RUTAS DE AUTH
const router = Router()

router.post('/register', register) // DEFINE LA RUTA POST /register Y ASIGNA LA FUNCIÓN register COMO HANDLER
router.post('/login', login) // DEFINE LA RUTA POST /login Y ASIGNA LA FUNCIÓN login COMO HANDLER
router.get('/me', authenticate, me) // DEFINE LA RUTA GET /me, APLICANDO PRIMERO authenticate Y LUEGO me

// EXPORTA EL ROUTER CONFIGURADO PARA USARLO EN LA APLICACIÓN PRINCIPAL
export default router
