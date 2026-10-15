const pool = require('../config/db');

const ReservaModel = {
    async obtenerReglaYield(ocupacion, anticipacion) {
        const { rows } = await pool.query(`
            SELECT multiplicador FROM reglas_yield 
            WHERE $1 BETWEEN ocupacion_min AND ocupacion_max 
              AND $2 BETWEEN anticipacion_min AND anticipacion_max 
            LIMIT 1;
        `, [ocupacion, anticipacion]);
        return rows[0] ? parseFloat(rows[0].multiplicador) : 1.0;
    },

    async create({ cliente_nombre, cliente_email, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_aplicado }) {
        const { rows } = await pool.query(`
            INSERT INTO reservas (cliente_nombre, cliente_email, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_aplicado)
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `, [cliente_nombre, cliente_email, habitacion_id, fecha_checkin, fecha_checkout, anticipacion_dias, precio_aplicado]);
        
        // Marcar habitación como Ocupada automáticamente tras reservar
        await pool.query("UPDATE habitaciones SET estado = 'Ocupada' WHERE id = $1", [habitacion_id]);
        
        return rows[0];
    },

    async findAll() {
        const { rows } = await pool.query(`
            SELECT r.*, h.numero AS habitacion_numero 
            FROM reservas r
            JOIN habitaciones h ON r.habitacion_id = h.id
            ORDER BY r.id DESC;
        `);
        return rows;
    }
};

module.exports = ReservaModel;