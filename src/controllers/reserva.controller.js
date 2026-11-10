const ReservaModel = require('../models/reserva.model');
const HabitacionModel = require('../models/habitacion.model');
const pool = require('../config/db');

const ReservaController = {
    async getAll(req, res) {
        try {
            // Opcional: Si quieres que un cliente normal solo vea sus propias reservas y el admin vea todas
            const usuario = req.user;
            let query = 'SELECT * FROM reservas';
            let params = [];

            if (usuario.rol !== 'admin') {
                query += ' WHERE usuario_id = $1';
                params.push(usuario.id);
            }

            const result = await pool.query(query, params);
            res.json({ success: true, data: result.rows });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 🛡️ Obtener por ID con validación de Resource Ownership
    async getById(req, res) {
        try {
            const { id } = req.params;
            const usuarioAutenticado = req.user; // Viene del token

            const result = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
            }
            
            const reserva = result.rows[0];

            // Validar si es admin o si es el dueño de la reserva
            const esAdmin = usuarioAutenticado.rol === 'admin';
            const esPropietario = reserva.usuario_id === usuarioAutenticado.id;

            if (!esAdmin && !esPropietario) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Acceso denegado: No tienes permisos para ver esta reserva' 
                });
            }

            res.json({ success: true, data: reserva });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async create(req, res) {
        try {
            const { cliente_nombre, cliente_email, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_base } = req.body;
            
            // Capturar el ID del usuario autenticado (viene del token gracias a verificarToken)
            const usuario_id = req.user ? req.user.id : null; 
            
            if (!cliente_nombre || !cliente_email || !habitacion_id || precio_base === undefined || anticipacion_dias === undefined) {
                return res.status(400).json({ success: false, message: 'Faltan datos obligatorios para la reserva' });
            }

            // Control estricto de sobreventa / Ocupación al 100%
            const ocupacionActual = await HabitacionModel.calcularOcupacionPorcentaje();
            if (ocupacionActual >= 100) {
                return res.status(400).json({ success: false, message: 'Control de sobreventa estricto: El hotel se encuentra al 100% de ocupación.' });
            }

            // Motor de Yield Management (Cálculo de tarifa dinámica algorítmica)
            const multiplicador = await ReservaModel.obtenerReglaYield(ocupacionActual, anticipacion_dias);
            const precio_aplicado = parseFloat(precio_base) * multiplicador;

            // Crear la reserva vinculando el usuario_id para el control de propiedad
            const nuevaReservaQuery = await pool.query(
                `INSERT INTO reservas (cliente_nombre, cliente_email, usuario_id, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_aplicado) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [cliente_nombre, cliente_email, usuario_id, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_aplicado]
            );

            res.status(201).json({ 
                success: true, 
                message: 'Reserva creada aplicando Yield Management con éxito', 
                multiplicador_yield: multiplicador,
                data: nuevaReservaQuery.rows[0] 
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    //Eliminar con validación estricta de Resource Ownership
    async delete(req, res) {
        try {
            const { id } = req.params;
            const usuarioAutenticado = req.user;

            // 1. Primero consultamos la reserva para verificar a quién pertenece
            const checkReserva = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]);
            
            if (checkReserva.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
            }

            const reserva = checkReserva.rows[0];

            //Validar propiedad o rol de administrador
            const esAdmin = usuarioAutenticado.rol === 'admin';
            const esPropietario = reserva.usuario_id === usuarioAutenticado.id;

            if (!esAdmin && !esPropietario) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Acceso denegado: No tienes permisos para eliminar esta reserva' 
                });
            }

            //Proceder con la eliminación si pasa la validación
            const result = await pool.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]);
            
            res.json({ success: true, message: 'Reserva eliminada con éxito', data: result.rows[0] });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = ReservaController;