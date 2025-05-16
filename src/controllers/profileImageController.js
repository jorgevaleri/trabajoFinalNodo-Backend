// backend/src/controllers/profileImageController.js
// IMPORTA EL MÓDULO FS PARA OPERACIONES DE SISTEMA DE ARCHIVOS
import fs from 'fs'
// IMPORTA EL MÓDULO PATH PARA RESOLVER RUTAS EN EL SISTEMA DE ARCHIVOS
import path from 'path'
// IMPORTA fileURLToPath PARA CONVERTIR URL DE MÓDULO A RUTA DE ARCHIVO
import { fileURLToPath } from 'url'

// OBTIENE LA RUTA DEL DIRECTORIO ACTUAL DEL MÓDULO
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// DEFINE LA CONSTANTE IMAGES_DIR APUNTANDO A public/profile-images
const IMAGES_DIR = path.join(__dirname, '../../public/profile‑images')

// EXPORTA LA FUNCIÓN listProfileImages PARA LISTAR IMÁGENES DE PERFIL
export function listProfileImages(req, res) {
  // LEE EL CONTENIDO DEL DIRECTORIO IMAGES_DIR DE FORMA ASÍNCRONA
  fs.readdir(IMAGES_DIR, (err, files) => {
    // SI HAY ERROR AL LEER EL DIRECTORIO, RESPONDE CON 500 Y MENSAJE
    if (err) return res.status(500).json({ message: 'Error leyendo imágenes' })
    // FILTRA SOLO LOS ARCHIVOS CON EXTENSIONES DE IMAGEN Y MAPEA A RUTAS PÚBLICAS
    const images = files
      .filter((f) => /\.(png|jpe?g|gif)$/i.test(f))
      .map((f) => `/profile‑images/${f}`)
    // RESPONDE CON UN JSON QUE CONTIENE EL ARRAY DE RUTAS DE IMÁGENES
    res.json({ images })
  })
}
