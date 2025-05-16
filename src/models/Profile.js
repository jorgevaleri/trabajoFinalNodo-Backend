// src/models/Profile.js
// IMPORTA MONGOOSE PARA DEFINIR ESQUEMAS Y MODELOS
import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  name:   { type: String, required: true }, // name: NOMBRE DEL PERFIL, TIPO STRING Y OBLIGATORIO
  age:    { type: Number, required: true }, // age: EDAD DEL PERFIL, TIPO NUMBER Y OBLIGATORIO
  avatar: { type: String, required: true },  // avatar: URL O RUTA DE LA IMAGEN DE AVATAR, TIPO STRING Y OBLIGATORIO

   // watchlist: LISTA DE IDs DE PELÍCULAS GUARDADOS, TIPO ARRAY DE STRINGS
  watchlist: {
    type: [String], // ASUMIENDO QUE SE GUARDAN IDs DE TMDB COMO STRINGS
    default: [], // SIEMPRE EMPIEZA COMO ARRAY VACÍO
  },
  
   // user: REFERENCIA AL USUARIO PROPIETARIO DEL PERFIL, TIPO ObjectId Y OBLIGATORIO
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

// EXPORTA EL MODELO 'Profile' BASADO EN profileSchema
export default mongoose.model('Profile', profileSchema)
