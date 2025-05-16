// backend/src/middleware/roleMiddleware.js
// EXPORTA UNA FUNCIÓN QUE GENERA UN MIDDLEWARE DE AUTORIZACIÓN POR ROLES
export function authorizeRoles(...allowed) {
  return (req, res, next) => {
    // SI NO HAY USUARIO AUTENTICADO O SU ROLE NO ESTÁ EN LA LISTA PERMITIDA
    if (!req.user || !allowed.includes(req.user.role)) {
      // RESPONDE CON ESTADO 403 Y MENSAJE DE ACCESO DENEGADO
      return res.status(403).json({ message: 'Acceso denegado' })
    }
    // SI TODO ES VÁLIDO, PASA AL SIGUIENTE MIDDLEWARE O CONTROLADOR
    next()
  }
}
