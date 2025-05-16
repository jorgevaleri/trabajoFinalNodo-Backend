// backend/src/routes/userRoutes.js
// IMPORTA EL MÉTODO ROUTER DESDE EXPRESS
import { Router } from 'express'
// IMPORTA EL MIDDLEWARE authenticate PARA PROTEGER RUTAS
import { authenticate } from '../middleware/authMiddleware.js'
// IMPORTA LAS FUNCIONES DEL CONTROLADOR userController PARA GESTIÓN DE USUARIOS
import {
  createUser,
  listUsers,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js'

// CREA UNA INSTANCIA DE ROUTER PARA DEFINIR RUTAS DE USUARIO
const router = Router()

// DEFINE LA RUTA POST / PARA CREAR UN NUEVO USUARIO, APLICANDO authenticate
router.post('/', authenticate, createUser)

// A PARTIR DE AQUÍ, TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
router.use(authenticate)

router.get('/',    listUsers) // DEFINE LA RUTA GET / PARA LISTAR TODOS LOS USUARIOS
router.get('/me',  getCurrentUser) // DEFINE LA RUTA GET /me PARA OBTENER DATOS DEL USUARIO AUTENTICADO
router.get('/:id', getUserById) // DEFINE LA RUTA GET /:id PARA OBTENER UN USUARIO POR SU ID
router.put('/:id', updateUser) // DEFINE LA RUTA PUT /:id PARA ACTUALIZAR UN USUARIO POR SU ID
router.delete('/:id', deleteUser) // DEFINE LA RUTA DELETE /:id PARA ELIMINAR UN USUARIO POR SU ID

// EXPORTA EL ROUTER CONFIGURADO PARA SU USO EN LA APLICACIÓN PRINCIPAL
export default router
