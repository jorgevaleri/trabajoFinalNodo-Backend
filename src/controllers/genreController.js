// backend/src/controllers/genreController.js
// IMPORTA EL MODELO Movie
import Movie from '../models/Movie.js'

// EXPORTA LA FUNCIÓN ASÍNCRONA listGenres PARA MANEJAR PETICIONES GET
export async function listGenres(req, res) {
  try {
    // OBTIENE UN ARRAY DE GÉNEROS ÚNICOS DE TODOS LOS DOCUMENTOS Movie EN LA BD
    const genres = await Movie.distinct('genres')
    // ORDENA EL ARRAY DE GÉNEROS EN ORDEN ALFABÉTICO USANDO localeCompare
    genres.sort((a, b) => a.localeCompare(b))
    // RESPONDE CON UN OBJETO JSON QUE CONTIENE LA PROPIEDAD genres
    res.json({ genres })
  } catch (err) {
    // SI HAY UN ERROR AL CONSULTAR LA BASE DE DATOS, LO IMPRIME EN CONSOLA
    console.error('Error al listar géneros desde DB:', err)
    // RESPONDE CON ESTADO 500 Y MENSAJE DE ERROR AL OBTENER GÉNEROS
    res.status(500).json({ message: 'Error al obtener géneros' })
  }
}
