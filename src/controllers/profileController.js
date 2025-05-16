// backend/src/controllers/profileController.js
// IMPORTA EL MODELO Profile
import Profile from '../models/Profile.js'
// IMPORTA EL MÓDULO fs PROMISES PARA OPERACIONES DE SISTEMA DE ARCHIVOS ASÍNCRONAS
import fs from 'fs/promises'
// IMPORTA EL MÓDULO path PARA RESOLVER RUTAS EN SISTEMA DE ARCHIVOS
import path from 'path'

// LISTA TODOS LOS PERFILES ASOCIADOS AL USUARIO AUTENTICADO
export async function listProfiles(req, res) {
  // BUSCA EN LA COLECCIÓN Profile LOS DOCUMENTOS CON user IGUAL A req.user._id
  const profiles = await Profile.find({ user: req.user._id })
  // ENVÍA LOS PERFILES EN FORMATO JSON
  res.json({ profiles })
}

// OBTIENE UN PERFIL POR SU ID
export async function getProfile(req, res) {
  // BUSCA EL PERFIL POR ID EN LA BASE DE DATOS
  const p = await Profile.findById(req.params.id)
  // SI NO SE ENCUENTRA, RESPONDE CON ERROR 404
  if (!p) return res.status(404).json({ message: 'Perfil no encontrado' })
  // SI SE ENCUENTRA, LO ENVÍA EN FORMATO JSON
  res.json(p)
}

// CREA UN NUEVO PERFIL PARA EL USUARIO AUTENTICADO
export async function createProfile(req, res) {
  // EXTRAe name, age Y avatar DEL CUERPO DE LA PETICIÓN
  const { name, age, avatar } = req.body
  // VALIDA QUE LOS CAMPOS OBLIGATORIOS ESTÉN PRESENTES
  if (!name || !age || !avatar) {
    // SI FALTAN CAMPOS, RESPONDE CON ERROR 400
    return res.status(400).json({ message: 'Faltan campos obligatorios' })
  }

  // CREA EL NUEVO PERFIL ASIGNÁNDOLE user = req.user._id
  const newP = await Profile.create({
    name,
    age,
    avatar,
    user: req.user._id,
  })
  // RESPONDE CON ESTADO 201 Y EL PERFIL CREADO
  res.status(201).json(newP)
}

// ACTUALIZA UN PERFIL EXISTENTE POR SU ID
export async function updateProfile(req, res) {
  // EXTRAe name, age Y avatar DEL CUERPO DE LA PETICIÓN
  const { name, age, avatar } = req.body
  // REALIZA LA ACTUALIZACIÓN CON runValidators PARA EJECUTAR VALIDACIONES
  const updated = await Profile.findByIdAndUpdate(
    req.params.id,
    { name, age, avatar },
    { new: true, runValidators: true }
  )
  // SI NO EXISTE EL PERFIL, RESPONDE CON ERROR 404
  if (!updated) return res.status(404).json({ message: 'Perfil no encontrado' })
  // SI SE ACTUALIZA, RESPONDE CON EL DOCUMENTO ACTUALIZADO
  res.json(updated)
}

// ELIMINA UN PERFIL POR SU ID
export async function deleteProfile(req, res) {
  // BORRA EL DOCUMENTO DE LA BASE DE DATOS
  await Profile.findByIdAndDelete(req.params.id)
  // RESPONDE CON ESTADO 204 (SIN CONTENIDO)
  res.status(204).end()
}

// LISTA LOS NOMBRES DE ARCHIVO DE profile-images
export async function listProfileImages(req, res) {
  try {
    // RESUELVE LA RUTA ABSOLUTA DEL DIRECTORIO public/profile-images
    const imagesDir = path.join(process.cwd(), 'public', 'profile-images')
    // LEE LOS NOMBRES DE ARCHIVO DENTRO DE imagesDir
    const files = await fs.readdir(imagesDir)
    // CONSTRUYE LA URL BASE (http://host)
    const baseUrl = `${req.protocol}://${req.get('host')}`
    // FILTRA SOLO ARCHIVOS DE IMAGEN Y MAPEA A URLs COMPLETAS
    const images = files
      .filter(f => /\.(png|jpe?g|gif)$/i.test(f))
      .map(f => `${baseUrl}/profile-images/${f}`)
    // RESPONDE CON EL ARRAY DE URLs DE IMÁGENES
    res.json({ images })
  } catch (err) {
    // SI OCURRE UN ERROR, LO IMPRIME EN CONSOLA
    console.error('Error leyendo imágenes de perfil:', err)
    // RESPONDE CON ERROR 500 Y MENSAJE
    res.status(500).json({ message: 'No se pudieron cargar las imágenes' })
  }
}
