const jwt = require('jsonwebtoken');
const SECRET_ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET || 'mi_access_secret_super_seguro';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, SECRET_ACCESS_TOKEN, (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = usuario; 
    next();
  });
};

// Middleware para verificar roles 
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
    }
    next();
  };
};

module.exports = { verificarToken, verificarRol };