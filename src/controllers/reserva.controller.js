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

    async create(req, res) {
        try {
            const { cliente_nombre, cliente_email, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_base } = req.body;
            
            if (!cliente_nombre || !cliente_email || !habitacion_id || precio_base === undefined || anticipacion_dias === undefined) {
                return res.status(400).json({ success: false, message: 'Faltan datos obligatorios para la reserva' });
            }

            // 1. Control estricto de sobreventa / Ocupación al 100%
            const ocupacionActual = await HabitacionModel.calcularOcupacionPorcentaje();
            if (ocupacionActual >= 100) {
                return res.status(400).json({ success: false, message: 'Control de sobreventa estricto: El hotel se encuentra al 100% de ocupación.' });
            }

            // 2. Motor de Yield Management (Cálculo de tarifa dinámica algorítmica)
            const multiplicador = await ReservaModel.obtenerReglaYield(ocupacionActual, anticipacion_dias);
            const precio_aplicado = parseFloat(precio_base) * multiplicador;

            // 3. Crear la reserva
            const nuevaReserva = await ReservaModel.create({
                cliente_nombre, cliente_email, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_aplicado
            });

            res.status(201).json({ 
                success: true, 
                message: 'Reserva creada aplicando Yield Management con éxito', 
                multiplicador_yield: multiplicador,
                data: nuevaReserva 
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = ReservaController;