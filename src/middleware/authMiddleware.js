// backend/src/middleware/authMiddleware.js
// IMPORTA jsonwebtoken PARA VERIFICAR Y DECODIFICAR TOKENS JWT
import jwt from 'jsonwebtoken'
// IMPORTA EL MODELO User PARA CARGAR DATOS DEL USUARIO DESDE LA BD
import User from '../models/User.js'

// OBTIENE LA CLAVE SECRETA PARA FIRMAR Y VERIFICAR JWT DESDE VARIABLES DE ENTORNO
const JWT_SECRET = process.env.JWT_SECRET

// VERIFICA QUE LLEGUE UN TOKEN VÁLIDO Y POBLA req.user CON EL USUARIO CORRESPONDIENTE
export async function authenticate(req, res, next) {
  try {
    // LEE EL ENCABEZADO Authorization DE LA PETICIÓN
    const header = req.headers.authorization
    // SI NO HAY ENCABEZADO, RESPONDE 401 'No token'
    if (!header) return res.status(401).json({ message: 'No token' })
    // ELIMINA EL PREFIJO 'Bearer ' PARA OBTENER SOLO EL TOKEN
    const token = header.replace(/^Bearer\s+/, '')
    // VERIFICA Y DECODIFICA EL TOKEN USANDO LA CLAVE SECRETA
    const payload = jwt.verify(token, JWT_SECRET)
    // BUSCA EN LA BD AL USUARIO CUYO ID VIENE EN EL PAYLOAD
    const user = await User.findById(payload.id)
    // SI NO SE ENCUENTRA EL USUARIO, RESPONDE 401 'Usuario no existe'
    if (!user) return res.status(401).json({ message: 'Usuario no existe' })
    // ASIGNA EL USUARIO A req.user PARA QUE LO USEN LOS SIGUIENTES MIDDLEWARES/CONTROLADORES
    req.user = user
    // CONTINÚA AL SIGUIENTE MIDDLEWARE
    next()
  } catch (err) {
    // SI HAY CUALQUIER ERROR (TOKEN INVÁLIDO, EXPIRADO, ETC.), RESPONDE 401 'Token inválido'
    return res.status(401).json({ message: 'Token inválido' })
  }
}

// AUTORIZA SOLO A USUARIOS CON ROLE 'admin' PARA CONTINUAR
export function authorizeAdmin(req, res, next) {
  // SI EL USUARIO AUTENTICADO TIENE role 'admin', PERMITE CONTINUAR
  if (req.user?.role === 'admin') {
    return next()
  }
  // SI NO ES ADMIN, RESPONDE 403 'Solo administradores'
  return res.status(403).json({ message: 'Solo administradores' })
}
