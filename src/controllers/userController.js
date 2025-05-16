// backend/src/controllers/userController.js
// IMPORTA EL MODELO User
import User from '../models/User.js'

// CREA UN NUEVO USUARIO
export async function createUser(req, res) {
  // EXTRAE email, password Y role DEL CUERPO DE LA PETICIÓN
  const { email, password, role } = req.body
  // VALIDA QUE role ESTÉ ENTRE LOS ROLES PERMITIDOS
  if (!['admin', 'adult', 'child'].includes(role)) {
    // SI role NO ES VÁLIDO, RESPONDE 400 CON MENSAJE DE ERROR
    return res.status(400).json({ message: 'Rol inválido' })
  }
  // CREA EL USUARIO CON LOS DATOS PROPORCIONADOS
  const user = await User.create({ email, password, role })
  // RESPONDE CON ESTADO 201 Y DATOS BÁSICOS DEL USUARIO CREADO
  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role
  })
}

// LISTA TODOS LOS USUARIOS (SÓLO ADMIN)
export async function listUsers(req, res) {
  // OBTIENE TODOS LOS USUARIOS EXCLUYENDO LA CONTRASEÑA
  const users = await User.find().select('-password')
  // MAPEA CADA USUARIO A UN OBJETO CON CAMPOS SEGUROS Y RESPONDE EN JSON
  res.json(users.map(u => ({
    _id: u._id,
    email: u.email,
    role: u.role
  })))
}

// DEVUELVE EL USUARIO AUTENTICADO
export async function getCurrentUser(req, res) {
  // req.user YA ESTÁ POBLADO POR EL MIDDLEWARE authenticate
  if (!req.user) {
    // SI NO HAY USUARIO, RESPONDE 404
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }
  // RESPONDE CON LOS DATOS BÁSICOS DEL USUARIO AUTENTICADO
  res.json({
    _id: req.user._id,
    email: req.user.email,
    role: req.user.role
  })
}

// DEVUELVE UN USUARIO POR ID (SÓLO ADMIN)
export async function getUserById(req, res) {
  // BUSCA EL USUARIO POR su _id EXCLUYENDO LA CONTRASEÑA
  const user = await User.findById(req.params.id).select('-password')
  // SI NO SE ENCUENTRA, RESPONDE 404
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  // RESPONDE CON LOS DATOS BÁSICOS DEL USUARIO
  res.json({
    _id: user._id,
    email: user.email,
    role: user.role
  })
}

// ACTUALIZA email, role Y/O contraseña
export async function updateUser(req, res) {
  // EXTRAe email, role Y password DEL CUERPO DE LA PETICIÓN
  const { email, role, password } = req.body
  // SI SE PROPORCIONA role, VALÍDALO
  if (role && !['admin', 'adult', 'child'].includes(role)) {
    // SI role NO ES VÁLIDO, RESPONDE 400
    return res.status(400).json({ message: 'Rol inválido' })
  }
  // BUSCA EL USUARIO POR ID
  const user = await User.findById(req.params.id)
  // SI NO EXISTE, RESPONDE 404
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

  // ACTUALIZA EL CAMPO email
  user.email = email
  // SI SE PROPORCIONA role, ACTUALÍZALO
  if (role) user.role = role
  // SI SE PROPORCIONA password, ACTUALÍZALO
  if (password) user.password = password

  // GUARDA LOS CAMBIOS EN LA BD
  await user.save()
  // CONVIERTE EL DOCUMENTO A OBJETO Y ELIMINA LA CONTRASEÑA
  const safe = user.toObject()
  delete safe.password
  // RESPONDE CON EL OBJETO ACTUALIZADO SIN password
  res.json(safe)
}

// ELIMINA UN USUARIO (SÓLO ADMIN)
export async function deleteUser(req, res) {
  // BORRA EL USUARIO POR ID
  await User.findByIdAndDelete(req.params.id)
  // RESPONDE CON ESTADO 204 (SIN CONTENIDO) PARA INDICAR QUE SE ELIMINÓ
  res.status(204).end()
}
