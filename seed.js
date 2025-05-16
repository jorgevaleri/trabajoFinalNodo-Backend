// backend/seed.js
// IMPORTA MONGOOSE PARA CONECTARSE A LA BASE DE DATOS MONGODB
import mongoose from 'mongoose'
// IMPORTA DOTENV PARA CARGAR VARIABLES DE ENTORNO DESDE UN ARCHIVO .ENV
import dotenv from 'dotenv'

// IMPORTA EL MODELO DE USUARIO
import User from './src/models/User.js'
// IMPORTA EL MODELO DE PERFIL
import Profile from './src/models/Profile.js'

// CARGA LAS VARIABLES DE ENTORNO DEFINIDAS EN EL ARCHIVO .ENV
dotenv.config()

// FUNCIÓN ASÍNCRONA PRINCIPAL PARA SEMBRAR DATOS EN LA BASE DE DATOS
async function seed() {
  try {
    // 1. CONECTA A LA BASE DE DATOS UTILIZANDO LA URI DE MONGODB DEL ARCHIVO .ENV
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // OPCIÓN PARA ANALIZADOR DE URL ANTIGUO
      useUnifiedTopology: true, // OPCIÓN PARA EL NUEVO MODO DE TOPOLOGÍA
    })
    console.log('Conectado a MongoDB')

    // 2. ELIMINA TODOS LOS DOCUMENTOS EXISTENTES EN LAS COLECCIONES DE USUARIOS Y PERFILES
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
    ])
    console.log('Usuarios y perfiles eliminados')

    // 3. CREA UN USUARIO CON ROL "OWNER" (PUEDE SER UN ERROR, PUES EL ENUM NO INCLUYE 'owner')
    const owner = await User.create({
      email: 'admin@nodocine.com',
      password: 'password123',
      role: 'admin',
    })
    console.log('Usuario owner creado:', owner.email)

    // 4. DEFINE DATOS DE DOS PERFILES QUE SE CREARÁN PARA ESE USUARIO
    const perfilesData = [
      { username: 'adulto', password: 'Adulto123', age: 30, avatarUrl: null },
      { username: 'nino', password: 'Nino123', age: 8, avatarUrl: null },
    ]

    // CREA LOS PERFILES EN LA BASE DE DATOS Y LOS RELACIONA CON EL USUARIO OWNER
    const perfiles = await Promise.all(
      perfilesData.map(p =>
        Profile.create({
          ...p, // EXPANDE LOS DATOS DEL PERFIL (username, password, etc.)
          user: owner._id, // RELACIONA EL PERFIL CON EL USUARIO CREADO
          watchlist: [], // INICIA LA LISTA DE PELÍCULAS VACÍA
        })
      )
    )

    // MUESTRA EN CONSOLA LOS NOMBRES DE USUARIO DE LOS PERFILES CREADOS
    console.log(
      `Perfiles creados: ${perfiles
        .map((p) => p.username)
        .join(', ')}`
    )

    // MENSAJE FINAL DE ÉXITO
    console.log('Seed completado con éxito')
  } catch (err) {
    // SI OCURRE ALGÚN ERROR, LO MUESTRA EN CONSOLA
    console.error('Error en seed:', err)
  } finally {
    // DESCONECTA DE LA BASE DE DATOS Y TERMINA EL PROCESO
    await mongoose.disconnect()
    process.exit()
  }
}


// EJECUTA LA FUNCIÓN PRINCIPAL
seed()
