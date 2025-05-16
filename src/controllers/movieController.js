// backend/src/controllers/movieController.js
// IMPORTA MÓDULO MONGOOSE PARA TRABAJAR CON ID DE MONGO Y OTRAS UTILIDADES
import mongoose from 'mongoose'
// IMPORTA EL MODELO Movie
import Movie from '../models/Movie.js'

// LSITA DE PELICULAS DESDE MONGODB CON PAGINACION Y FILTROS.
// page   (número de página, default 1)
// limit  (tamaño de página, default 20)
// search (texto a buscar en título)
// genre  (nombre de género exacto)

// EXPORTA LA FUNCIÓN ASÍNCRONA listMovies PARA MANEJAR PETICIONES GET
export async function listMovies(req, res) {
  try {
    // PARSEA page DESDE QUERY O USA 1 SI NO VIENE
    const page = parseInt(req.query.page, 10) || 1
    // PARSEA limit DESDE QUERY O USA 20 SI NO VIENE
    const limit = parseInt(req.query.limit, 10) || 20
    // TOMA search DESDE QUERY O CADENA VACÍA SI NO VIENE
    const search = req.query.search || ''
    // TOMA genre DESDE QUERY O CADENA VACÍA SI NO VIENE
    const genre = req.query.genre || ''

    // INICIA UN OBJETO filter VACÍO PARA AÑADIR CONDICIONES
    const filter = {}
    // SI search NO ESTÁ VACÍO, AGREGA UN REGEXP INSENSIBLE A MAYÚSCULAS EN title
    if (search) filter.title = new RegExp(search, 'i')
    // SI genre NO ESTÁ VACÍO, FILTRA POR ESE GÉNERO EN EL ARRAY genres
    if (genre) filter.genres = genre

    // CUENTA EL TOTAL DE DOCUMENTOS QUE CUMPLEN EL FILTRO
    const total = await Movie.countDocuments(filter)
    // CONSULTA LA BASE DE DATOS APLICANDO FILTRO, PAGINACIÓN Y ORDEN ALFABÉTICO POR TÍTULO
    const moviesFromDB = await Movie.find(filter)
      .skip((page - 1) * limit) // OMITE LOS DOCUMENTOS DE LAS PÁGINAS ANTERIORES
      .limit(limit) // LIMITA LA CANTIDAD DE RESULTADOS A 'limit'
      .sort({ title: 1 }) // ORDENA POR TÍTULO ASCENDENTE

    // FORMATEA LOS DATOS PARA ENVIARLOS AL FRONTEND
    const movies = moviesFromDB.map(m => ({
      _id: m._id.toString(), // CONVIERTE _id A STRING PARA COMPATIBILIDAD CON REACT
      tmdbId: m.tmdbId, // ID DE TMDB
      title: m.title, // TÍTULO DE LA PELÍCULA
      description: m.description, // DESCRIPCIÓN
      posterUrl: m.posterUrl, // URL DEL PÓSTER
      genres: m.genres, // ARRAY DE GÉNEROS
      minAge: m.minAge, // EDAD MÍNIMA RECOMENDADA
    }))

    // ENVÍA LA RESPUESTA EN FORMATO JSON CON LA LISTA, NÚMERO DE PÁGINA, TOTAL DE PÁGINAS Y TOTAL DE ELEMENTOS
    res.json({
      movies,
      page,
      totalPages: Math.ceil(total / limit), // CALCULA TOTAL DE PÁGINAS
      totalItems: total // CANTIDAD TOTAL DE RESULTADOS
    })
  } catch (err) {
    // SI OCURRE UN ERROR, LO MUESTRA EN CONSOLA
    console.error('Error al listar películas desde DB:', err)
    // RESPONDE CON UN ERROR 500 Y MENSAJE PERSONALIZADO
    res.status(500).json({ message: 'Error al obtener películas' })
  }
}

// DEVUELVE UNA PELICULA POR SU _ID DE MONGODB O, SI NO ES UN OBJECTID
// FUNCIÓN ASÍNCRONA QUE DEVUELVE UNA PELÍCULA SEGÚN SU ID DE MONGODB O tmdbId
export async function getMovieById(req, res) {
  // OBTIENE EL ID DE LA PELÍCULA DESDE LOS PARÁMETROS DE LA RUTA
  const { id } = req.params

  let movie
  // 1) SI EL ID ES UN ObjectId VÁLIDO, BUSCA POR _id EN LA BASE DE DATOS
  if (mongoose.Types.ObjectId.isValid(id)) {
    movie = await Movie.findById(id)
  }
  // 2) SI NO SE ENCONTRÓ POR _id, INTENTA BUSCAR POR EL CAMPO tmdbId
  if (!movie) {
    movie = await Movie.findOne({ tmdbId: id.toString() })
  }

  // SI NO SE ENCONTRÓ NINGUNA PELÍCULA, RESPONDE CON 404 Y MENSAJE DE ERROR
  if (!movie) {
    return res.status(404).json({ message: 'Película no encontrada' })
  }

  // FORMATEA Y ENVÍA LA RESPUESTA CON LOS DATOS DE LA PELÍCULA
  res.json({
    _id: movie._id.toString(), // CONVIERTE _id A STRING
    tmdbId: movie.tmdbId, // ID DE TMDB
    title: movie.title, // TÍTULO
    description: movie.description, // DESCRIPCIÓN
    posterUrl: movie.posterUrl, // URL DEL PÓSTER
    genres: movie.genres, // ARRAY DE GÉNEROS
    minAge: movie.minAge, // EDAD MÍNIMA RECOMENDADA
  })
}