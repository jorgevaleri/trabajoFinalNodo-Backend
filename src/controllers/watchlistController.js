// backend/src/controllers/watchlistController.js
// IMPORTA EL MODELO Profile
import Profile from '../models/Profile.js'

// DEVUELVE LA WATCHLIST DE UN PERFIL SEGÚN profileId Y USUARIO AUTENTICADO
export async function getWatchlist(req, res) {
  // EXTRAÍMOS profileId DE LOS QUERY PARAMS
  const { profileId } = req.query
  // BUSCAMOS EL PERFIL PERTENECIENTE AL USUARIO AUTENTICADO
  const profile = await Profile.findOne({
    _id: profileId,
    user: req.user._id
  })
  // SI NO EXISTE EL PERFIL, RESPONDEMOS 404
  if (!profile) {
    return res.status(404).json({ message: 'Perfil no encontrado' })
  }
  // DEVOLVEMOS LA PROPIEDAD watchlist (O ARRAY VACÍO SI NO EXISTE)
  return res.json({ watchlist: profile.watchlist || [] })
}

// FUNCIÓN PARA AÑADIR UNA PELÍCULA A LA WATCHLIST
export async function addToWatchlist(req, res) {
  // EXTRAÉ profileId Y movieId DEL CUERPO DE LA PETICIÓN
  const { profileId, movieId } = req.body
  // AÑADE movieId A watchlist SI NO ESTÁ YA PRESENTE Y RETORNA EL DOCUMENTO ACTUALIZADO
  const profile = await Profile.findOneAndUpdate(
    { _id: profileId, user: req.user._id },
    { $addToSet: { watchlist: movieId } },
    { new: true }
  ).populate('watchlist')
  // RESPONDE CON LA LISTA ACTUALIZADA DE watchlist
  res.json({ watchlist: profile.watchlist })
}

// FUNCIÓN PARA ELIMINAR UNA PELÍCULA DE LA WATCHLIST
export async function removeFromWatchlist(req, res) {
  // EXTRAÉ profileId Y movieId DE LOS PARAMS DE LA RUTA
  const { profileId, movieId } = req.params
  // ELIMINA movieId DE watchlist Y RETORNA EL DOCUMENTO ACTUALIZADO
  const profile = await Profile.findOneAndUpdate(
    { _id: profileId, user: req.user._id },
    { $pull: { watchlist: movieId } },
    { new: true }
  ).populate('watchlist')
  // RESPONDE CON LA LISTA ACTUALIZADA DE watchlist
  res.json({ watchlist: profile.watchlist })
}
