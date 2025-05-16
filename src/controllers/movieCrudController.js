// backend/src/controllers/movieCrudController.js
// IMPORTA EL MODELO Movie
import Movie from '../models/Movie.js'

// DEFINE UN OBJETO QUE MUESTRA LA RELACIÓN ENTRE ID DE TMDB Y NOMBRE DE GÉNERO
const genresMap = {
  28:    'Acción',
  12:    'Aventura',
  16:    'Animación',
  35:    'Comedia',
  80:    'Crimen',
  99:    'Documental',
  18:    'Drama',
  10751: 'Familiar',
  14:    'Fantasía',
  36:    'Historia',
  27:    'Terror',
  10402: 'Música',
  9648:  'Misterio',
  10749: 'Romance',
  878:   'Ciencia Ficción',
  10770: 'TV Movie',
  53:    'Suspenso',
  10752: 'Guerra',
  37:    'Western',
}

// EXPORTA LA FUNCIÓN getAllGenres PARA OBTENER TODOS LOS GÉNEROS DISPONIBLES
export async function getAllGenres(req, res) {
   // TRANSFORMA EL OBJETO genresMap EN UN ARRAY DE OBJETOS { id, name }
  const allGenres = Object.entries(genresMap).map(([id, name]) => ({
    id:   Number(id),
    name,
  }))
  // RESPONDE CON UN JSON QUE INCLUYE LA PROPIEDAD genres
  res.json({ genres: allGenres })
}

// EXPORTA LA FUNCIÓN createMovieCrud PARA CREAR UNA NUEVA PELÍCULA
export async function createMovieCrud(req, res) {
  // CREA LA PELÍCULA USANDO LOS DATOS DEL BODY DE LA PETICIÓN
  const m = await Movie.create(req.body)
  // RESPONDE CON ESTADO 201 Y EL OBJETO DE LA PELÍCULA CREADA
  res.status(201).json(m)
}


// EXPORTA LA FUNCIÓN listMoviesCrud PARA LISTAR PELÍCULAS CON FILTRADO Y ORDEN
export async function listMoviesCrud(req, res) {
  // EXTRAe search, genre, sortBy Y order DE LOS QUERY PARAMS
  const { search, genre, sortBy = 'title', order = 'asc' } = req.query

  // INICIA UN OBJETO filter VACÍO PARA APLICAR CONDICIONES DE BÚSQUEDA
  const filter = {}
   // SI HAY search, AÑADE UN FILTRO POR TÍTULO CON EXPRESIÓN REGULAR
  if (search) filter.title = new RegExp(search, 'i')
     // SI HAY genre, AÑADE FILTRO POR COINCIDENCIA EN EL ARRAY genres
  if (genre)  filter.genres = genre

    // DETERMINA EL ORDEN DE SORT SEGÚN order ('asc' → 1, 'desc' → -1)
  const sortOrder = order === 'asc' ? 1 : -1
  // BUSCA LAS PELÍCULAS APLICANDO filter Y ORDENANDO POR sortBy
  const movies = await Movie.find(filter).sort({ [sortBy]: sortOrder })

   // AÑADE genreNames A CADA PELÍCULA MAPEANDO genre_ids AL NOMBRE CORRESPONDIENTE
  const withNames = movies.map(m => ({
    ...m.toObject(),
    genreNames: (m.genre_ids || []).map(id => genresMap[id]).filter(Boolean),
  }))

  // RESPONDE CON EL ARRAY DE PELÍCULAS YA INCLUIDO genreNames
  res.json(withNames)
}

// EXPORTA LA FUNCIÓN getMovieCrud PARA OBTENER UNA PELÍCULA POR ID
export async function getMovieCrud(req, res) {
  // BUSCA LA PELÍCULA POR _id USANDO findById
  const m = await Movie.findById(req.params.id)
   // SI NO EXISTE, RESPONDE 404 CON MENSAJE DE ERROR
  if (!m) {
    return res.status(404).json({ message: 'Película no encontrada' })
  }

   // CONVIERTE EL DOCUMENTO A OBJETO JSON
  const movie = m.toObject()
   // AÑADE genreNames TRANSFORMANDO genre_ids AL NOMBRE DEL GÉNERO
  movie.genreNames = (movie.genre_ids || [])
    .map(id => genresMap[id])
    .filter(Boolean)
    // RESPONDE CON EL OBJETO movie YA PROCESSADO
  res.json(movie)
}

// EXPORTA LA FUNCIÓN updateMovieCrud PARA ACTUALIZAR UNA PELÍCULA EXISTENTE
export async function updateMovieCrud(req, res) {
  // ACTUALIZA LA PELÍCULA Y RETORNA EL DOCUMENTO NUEVO
  const m = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
   // SI NO SE ENCUENTRA LA PELÍCULA, RESPONDE 404
  if (!m) {
    return res.status(404).json({ message: 'Película no encontrada' })
  }
   // CONVIERTE EL DOCUMENTO ACTUALIZADO A OBJETO
  const movie = m.toObject()
   // AÑADE genreNames SEGÚN genre_ids
  movie.genreNames = (movie.genre_ids || [])
    .map(id => genresMap[id])
    .filter(Boolean)
    // RESPONDE CON EL OBJETO ACTUALIZADO
  res.json(movie)
}

// EXPORTA LA FUNCIÓN deleteMovieCrud PARA ELIMINAR UNA PELÍCULA POR ID
export async function deleteMovieCrud(req, res) {
  // ELIMINA EL DOCUMENTO DE LA BASE DE DATOS
  await Movie.findByIdAndDelete(req.params.id)
  // RESPONDE CON ESTADO 204 (SIN CONTENIDO) PARA INDICAR ÉXITO
  res.status(204).end()
}
