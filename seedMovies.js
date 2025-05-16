// backend/seedMovies.js
// IMPORTA MONGOOSE PARA CONECTARSE A MONGODB
import mongoose from 'mongoose'
// IMPORTA AXIOS PARA HACER PETICIONES HTTP A LA API DE TMDB
import axios from 'axios'
// IMPORTA DOTENV PARA LEER VARIABLES DE ENTORNO DESDE .ENV
import dotenv from 'dotenv'
// IMPORTA EL MODELO DE PELÍCULA
import Movie from './src/models/Movie.js'

// CARGA LAS VARIABLES DE ENTORNO DEFINIDAS EN EL ARCHIVO .ENV
dotenv.config()

// 1) CONEXIÓN A MONGODB ATLAS USANDO LA URI DEFINIDA EN LAS VARIABLES DE ENTORNO
await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
console.log('Conectado a MongoDB Atlas')

// 2) CREA UNA INSTANCIA DE AXIOS CONFIGURADA PARA LA API DE TMDB CON EL IDIOMA EN ESPAÑOL
const tmdb = axios.create({ baseURL: 'https://api.themoviedb.org/3', params: { api_key: process.env.TMDB_API_KEY, language: 'es-ES' } })
// REALIZA UNA PETICIÓN PARA OBTENER LA LISTA DE GÉNEROS DE PELÍCULAS
const { data: { genres: tmdbGenres } } = await tmdb.get('/genre/movie/list')
// CREA UN MAPA CON LOS GÉNEROS DONDE LA CLAVE ES EL ID Y EL VALOR ES EL NOMBRE DEL GÉNERO
const genreMap = tmdbGenres.reduce((m, g) => (m[g.id] = g.name, m), {})

// 3) DEFINE UNA FUNCIÓN RECURSIVA PARA CARGAR VARIAS PÁGINAS DE PELÍCULAS POPULARES DESDE TMDB
async function processPage(page = 1, maxPages = 50) {
  console.log(`Cargando página ${page}`)
  // OBTIENE LA INFORMACIÓN DE LA PÁGINA ACTUAL DE PELÍCULAS POPULARES
  const { data } = await tmdb.get('/movie/popular', { params: { page } })

  // RECORRE CADA PELÍCULA DE LA RESPUESTA
  for (const m of data.results) {
    // OBTIENE LAS FECHAS DE ESTRENO Y CERTIFICACIONES DE LA PELÍCULA
    const rd = await tmdb.get(`/movie/${m.id}/release_dates`)
    const usBlock = rd.data.results.find(r => r.iso_3166_1 === 'US') || {}
    const cert = usBlock.release_dates?.[0]?.certification || ''
    // MAPEAMOS LA CERTIFICACIÓN A UNA EDAD MÍNIMA
    const minAge = mapCertToAge(cert)

    // CREAMOS UN DOCUMENTO CON LOS DATOS DE LA PELÍCULA
    const doc = {
      tmdbId: m.id.toString(), // ID DE TMDB COMO STRING
      title: m.title, // TÍTULO DE LA PELÍCULA
      description: m.overview, // DESCRIPCIÓN/TEXTO DE SINOPSIS
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null, // URL COMPLETA DEL POSTER
      genres: m.genre_ids.map(String), // IDS DE GÉNEROS COMO STRINGS
      genreNames: m.genre_ids.map(id => genreMap[id] || '—'), // NOMBRES DE GÉNEROS TRADUCIDOS
      minAge // EDAD MÍNIMA ESTIMADA
    }

    // INSERTA O ACTUALIZA LA PELÍCULA EN LA BASE DE DATOS SEGÚN EL ID DE TMDB
    await Movie.updateOne({ tmdbId: doc.tmdbId }, { $set: doc }, { upsert: true })
    // MUESTRA EN CONSOLA QUE LA PELÍCULA FUE GUARDADA O ACTUALIZADA
    console.log(`Guardado/actualizado: ${m.title}`)
  }

  // SI HAY MÁS PÁGINAS Y NO SE ALCANZÓ EL LÍMITE, LLAMA A LA SIGUIENTE PÁGINA RECURSIVAMENTE
  if (page < data.total_pages && page < maxPages) {
    await processPage(page + 1, maxPages)
  }
}

// BLOQUE PRINCIPAL PARA EJECUTAR EL PROCESO
try {
  // INICIA EL PROCESO DE CARGA DESDE LA PÁGINA 1 HASTA LA 50
  await processPage(1, 50)
  console.log('Seed completado correctamente')
} catch (err) {
  // SI OCURRE UN ERROR, LO MUESTRA EN CONSOLA
  console.error('Error durante seed:', err)
} finally {
  // DESCONECTA DE LA BASE DE DATOS
  await mongoose.disconnect()
}

// FUNCIÓN AUXILIAR QUE CONVIERTE CERTIFICACIONES A EDADES MÍNIMAS
function mapCertToAge(cert) {
  switch (cert) {
    case 'G': return 0 // TODOS LOS PÚBLICOS
    case 'PG': return 7 // GUIA PARENTAL SUGERIDA
    case 'PG-13': return 13 // NO RECOMENDADO PARA MENORES DE 13
    case 'R': return 17 // RESTRINGIDO A MAYORES DE 17
    case 'NC-17': return 18 // NO ADMITIDOS MENORES DE 18
    default: return 0 // POR DEFECTO, SE CONSIDERA PARA TODO PÚBLICO
  }
}
