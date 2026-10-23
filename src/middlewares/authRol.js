// middleware/authRol.js
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Suponiendo que el rol viene en los headers para la prueba académica
    const rolUsuario = req.headers['x-user-role'] || 'cliente'; 

    if (rolesPermitidos.includes(rolUsuario)) {
      next(); // Pasa al controlador
    } else {
      res.status(403).json({ message: 'Acceso denegado: No tienes permisos de rol suficientes.' });
    }
  };
};

module.exports = verificarRol;