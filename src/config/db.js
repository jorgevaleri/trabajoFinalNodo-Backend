// backend/src/config/db.js

import mongoose from 'mongoose'

//CONECTA A MONGODB
export function connectDB() {
  //SE USA LA URI DE CONEXION DE .ENV
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
