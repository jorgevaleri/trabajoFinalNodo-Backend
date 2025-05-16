// backend/src/models/User.js
// IMPORTA EL MÓDULO MONGOOSE PARA DEFINIR ESQUEMAS Y MODELOS
import mongoose from 'mongoose'
// IMPORTA BCRYPT PARA HASHEAR Y COMPARAR CONTRASEÑAS DE FORMA SEGURA
import bcrypt from 'bcrypt'

// DEFINE EL SCHEMA UserSchema CON CAMPOS email, password Y role
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },   // email: DIRECCIÓN DE CORREO ELECTRÓNICO, TIPO STRING, OBLIGATORIO Y ÚNICO
  password: { type: String, required: true }, // password: CONTRASEÑA DEL USUARIO, TIPO STRING Y OBLIGATORIO
  // role: ROL DEL USUARIO, CON VALORES ENUMERADOS Y VALOR POR DEFECTO 'adult'
  role: {
    type: String,
    enum: ['admin', 'adult', 'child'],
    default: 'adult'
  }
})

// HOOK PRE-SAVE: SE EJECUTA ANTES DE GUARDAR UN USUARIO
UserSchema.pre('save', async function (next) {
  // SI LA CONTRASEÑA NO FUE MODIFICADA, CONTINUA SIN HASHEAR
  if (!this.isModified('password')) return next()
  // HASHEA LA CONTRASEÑA CON BCRYPT UTILIZANDO 10 RONDAS DE SALT
  this.password = await bcrypt.hash(this.password, 10)
  // CONTINÚA CON EL GUARDADO
  next()
})

// MÉTODO DE INSTANCIA comparePassword PARA COMPARAR CONTRASEÑAS
UserSchema.methods.comparePassword = function (pw) {
  // COMPARA LA CONTRASEÑA PLANA CON EL HASH ALMACENADO
  return bcrypt.compare(pw, this.password)
}

// EXPORTA EL MODELO 'User' BASADO EN UserSchema
export default mongoose.model('User', UserSchema)
