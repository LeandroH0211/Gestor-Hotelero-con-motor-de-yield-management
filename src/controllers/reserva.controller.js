const ReservaModel = require('../models/reserva.model');
const HabitacionModel = require('../models/habitacion.model');
const pool = require('../config/db');

const ReservaController = {
    async getAll(req, res) {
        try {
            const reservas = await ReservaModel.findAll();
            res.json({ success: true, data: reservas });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // 1. Añadido getById para cumplir con la ruta por ID y Resource Ownership
    async getById(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
            }
            
            res.json({ success: true, data: result.rows[0] });
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

            //Control estricto de sobreventa / Ocupación al 100%
            const ocupacionActual = await HabitacionModel.calcularOcupacionPorcentaje();
            if (ocupacionActual >= 100) {
                return res.status(400).json({ success: false, message: 'Control de sobreventa estricto: El hotel se encuentra al 100% de ocupación.' });
            }

            //Motor de Yield Management (Cálculo de tarifa dinámica algorítmica)
            const multiplicador = await ReservaModel.obtenerReglaYield(ocupacionActual, anticipacion_dias);
            const precio_aplicado = parseFloat(precio_base) * multiplicador;

            //Crear la reserva vinculando el usuario_id para el control de propiedad
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

    //Añadido delete para permitir eliminar reservas aplicando Resource Ownership
    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await pool.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
            }
            
            res.json({ success: true, message: 'Reserva eliminada con éxito', data: result.rows[0] });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = ReservaController;