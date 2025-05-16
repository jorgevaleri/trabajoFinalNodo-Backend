// backend/src/controllers/authController.js

// IMPORTA EL MÓDULO DOTENV PARA GESTIONAR VARIABLES DE ENTORNO
import dotenv from 'dotenv'
// EJECUTA LA CONFIGURACIÓN DE DOTENV, CARGANDO VARIABLES DESDE EL ARCHIVO .env
dotenv.config()

// IMPORTA EL MODELO User
import User from '../models/User.js'
// IMPORTA LA LIBRERÍA jsonwebtoken PARA GENERAR Y VERIFICAR TOKENS JWT
import jwt from 'jsonwebtoken'

// ASIGNA A JWT_SECRET LA VARIABLE DE ENTORNO process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET
// DEFINE LA DURACIÓN DE EXPIRACIÓN DEL TOKEN COMO 7 DÍAS
const JWT_EXPIRES = '7d'

// SI NO SE HA DEFINIDO JWT_SECRET, MUESTRA UN ERROR Y TERMINA LA EJECUCIÓN
if (!JWT_SECRET) {
  console.error('❌ Error: la variable de entorno JWT_SECRET no está definida.')
  process.exit(1)
}

// GENERA Y RETORNA UN TOKEN JWT CON EL ID DEL USUARIO Y LA CLAVE SECRETA
function generateToken(user) {
  return jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
}

// REGISTRA UN NUEVO USUARIO Y DEVUELVE UN TOKEN
export async function register(req, res) {
  try {
    // EXTRAe email, password Y role DEL CUERPO DE LA PETICIÓN
    const { email, password, role } = req.body
    // DEFINE LOS ROLES PERMITIDOS PARA REGISTRARSE
    const allowedRoles = ['admin', 'adult', 'child']
    // SI EL ROLE NO ESTÁ EN LA LISTA PERMITIDA, RESPONDE CON ERROR 400
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' })
    }

    // CREA UN NUEVO USUARIO; EL HOOK pre-save SE ENCARGA DE HASHER LA PASSWORD
    const user = await User.create({ email, password, role })

    // RESPONDE CON CÓDIGO 201 INCLUYENDO TOKEN Y DATOS BÁSICOS DEL USUARIO
    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, email: user.email, role: user.role }
    })
  } catch (err) {
    // EN CASO DE ERROR, LO MUESTRA POR CONSOLA Y RESPONDE CON ERROR 500
    console.error('Error en register:', err)
    res.status(500).json({ message: 'Error interno al registrar usuario' })
  }
}

//AUTENTICA UN USUARIO EXISTENTE Y DEVUELVE UN TOKEN
export async function login(req, res) {
  try {
    // EXTRAe email Y password DEL CUERPO DE LA PETICIÓN
    const { email, password } = req.body
    // BUSCA UN USUARIO POR EMAIL EN LA BASE DE DATOS
    const user = await User.findOne({ email })
    // SI NO EXISTE EL USUARIO O LA CONTRASEÑA NO COINCIDE, RESPONDE 401
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // SI TODO ES VÁLIDO, RETORNA EL TOKEN Y LOS DATOS BÁSICOS DEL USUARIO
    res.json({
      token: generateToken(user),
      user: { id: user._id, email: user.email, role: user.role }
    })
  } catch (err) {
    // EN CASO DE ERROR, LO MUESTRA POR CONSOLA Y RESPONDE CON ERROR 500
    console.error('Error en login:', err)
    res.status(500).json({ message: 'Error interno al iniciar sesión' })
  }
}

//DEVUELVE LOS DATOS DEL USUARIO AUTENTICADO
export async function me(req, res) {
  // RESPONDE CON EL OBJETO user QUE SE HA INYECTADO EN req POR EL MIDDLEWARE DE AUTENTICACIÓN
  res.json({ user: req.user })
}