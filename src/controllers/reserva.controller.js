const ReservaModel = require('../models/reserva.model');
const HabitacionModel = require('../models/habitacion.model');
const pool = require('../config/db');

const ReservaController = {
    async getAll(req, res, next) {
        try {
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
            next(err); // Delega el error al middleware global
        }
    },

    // Obtener por ID con validación de Resource Ownership
    async getById(req, res, next) {
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
            next(err); // Delega el error al middleware global
        }
    },

    async create(req, res, next) {
        try {
            const { cliente_nombre, cliente_email, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_base } = req.body;
            
            // Capturar el ID del usuario autenticado (viene del token gracias a verificarToken)
            const usuario_id = req.user ? req.user.id : null; 
            
            if (!cliente_nombre || !cliente_email || !habitacion_id || precio_base === undefined || anticipacion_dias === undefined || !fecha_checkin || !fecha_checkout) {
                return res.status(400).json({ success: false, message: 'Faltan datos obligatorios para la reserva (incluyendo fechas)' });
            }

            // Calcular el número de noches entre el check-in y el check-out
            const checkinDate = new Date(fecha_checkin);
            const checkoutDate = new Date(fecha_checkout);
            const diferenciaMilisegundos = checkoutDate - checkinDate;
            const numeroNoches = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

            if (numeroNoches <= 0) {
                return res.status(400).json({ success: false, message: 'La fecha de check-out debe ser posterior a la fecha de check-in' });
            }

            // Control estricto de sobreventa / Ocupación al 100%
            const ocupacionActual = await HabitacionModel.calcularOcupacionPorcentaje();
            if (ocupacionActual >= 100) {
                return res.status(400).json({ success: false, message: 'Control de sobreventa estricto: El hotel se encuentra al 100% de ocupación.' });
            }

            // Motor de Yield Management (Tarifa por noche ajustada dinámicamente)
            const multiplicador = await ReservaModel.obtenerReglaYield(ocupacionActual, anticipacion_dias);
            const precioPorNoche = parseFloat(precio_base) * multiplicador;

            // Calcular el precio total de la estancia multiplicando por el número de noches
            const precioTotalAplicado = precioPorNoche * numeroNoches;

            // Crear la reserva vinculando el usuario_id y el precio total calculado
            const nuevaReservaQuery = await pool.query(
                `INSERT INTO reservas (cliente_nombre, cliente_email, usuario_id, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_aplicado) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [cliente_nombre, cliente_email, usuario_id, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precioTotalAplicado]
            );

            // Sincronización: Marcar la habitación como 'Ocupada'
            await HabitacionModel.actualizarEstado(habitacion_id, 'Ocupada');

            res.status(201).json({ 
                success: true, 
                message: 'Reserva creada aplicando Yield Management con éxito', 
                multiplicador: multiplicador,             
                multiplicador_yield: multiplicador,     
                detalles_cobro: {
                    precio_por_noche: precioPorNoche.toFixed(2),
                    noches: numeroNoches,
                    multiplicador_yield: multiplicador,
                    total_a_pagar: precioTotalAplicado.toFixed(2)
                },
                data: nuevaReservaQuery.rows[0] 
            });
        } catch (err) {
            next(err); // Delega el error al middleware global
        }
    },

    // Eliminar con validación estricta de Resource Ownership
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const usuarioAutenticado = req.user;

            // Consultamos la reserva para verificar a quién pertenece
            const checkReserva = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]);
            
            if (checkReserva.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
            }

            const reserva = checkReserva.rows[0];

            // Validar propiedad o rol de administrador
            const esAdmin = usuarioAutenticado.rol === 'admin';
            const esPropietario = reserva.usuario_id === usuarioAutenticado.id;

            if (!esAdmin && !esPropietario) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Acceso denegado: No tienes permisos para eliminar esta reserva' 
                });
            }

            // Eliminación si pasa la validación
            const result = await pool.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]);
            const reservaEliminada = result.rows[0];

            // Sincronización: Liberar la habitación cambiándola a 'Disponible'
            if (reservaEliminada && reservaEliminada.habitacion_id) {
                await HabitacionModel.actualizarEstado(reservaEliminada.habitacion_id, 'Disponible');
            }
            
            res.json({ success: true, message: 'Reserva eliminada con éxito', data: reservaEliminada });
        } catch (err) {
            next(err); // Delega el error al middleware global
        }
    }
};

module.exports = ReservaController;