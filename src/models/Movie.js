// backend/src/models/Movie.js
// IMPORTA MONGOOSE PARA DEFINIR EL ESQUEMA Y MODELO DE DATOS
import mongoose from 'mongoose'

// DEFINE EL ESQUEMA MovieSchema CON LOS CAMPOS Y TIPOS CORRESPONDIENTES
const MovieSchema = new mongoose.Schema({
  tmdbId: { type: String, unique: true }, // IDENTIFICADOR TMDB, CADENA ÚNICA EN LA COLECCIÓN
  title: String, // TÍTULO DE LA PELÍCULA
  description: String, // DESCRIPCIÓN DE LA PELÍCULA
  posterUrl: String, // DESCRIPCIÓN DE LA PELÍCULA
  genres: [String], // ARRAY DE GÉNEROS, CADA UNO COMO CADENA
  minAge: Number, // EDAD MÍNIMA RECOMENDADA PARA LA PELÍCULA
})

// EXPORTA EL MODELO 'Movie' BASADO EN MovieSchema
export default mongoose.model('Movie', MovieSchema)
