const pool = require('../config/db');

const verificarPropietarioReserva = async (req, res, next) => {
  try {
    const reservaId = req.params.id;
    const usuarioId = req.user.id; // Viene del token decodificado en verificarToken
    const userRole = req.user.rol;

    // Si es admin o recepcionista, tiene acceso total (RBAC superior)
    if (userRole === 'admin' || userRole === 'recepcionista') {
      return next();
    }

    // Si es cliente, verificamos si la reserva le pertenece (Resource Ownership)
    const result = await pool.query('SELECT * FROM reservas WHERE id = $1 AND usuario_id = $2', [reservaId, usuarioId]);

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permisos sobre esta reserva' });
    }

    next();
  } catch (error) {
    console.error('Error en verificación de propiedad:', error);
    return res.status(500).json({ error: 'Error interno de autorización' });
  }
};

module.exports = { verificarPropietarioReserva };