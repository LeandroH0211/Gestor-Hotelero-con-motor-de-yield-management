const pool = require('../config/db');

const HabitacionModel = {
    async findAll() {
        const { rows } = await pool.query(`
            SELECT h.id, h.numero, h.estado, t.nombre AS tipo, t.precio_base, t.capacidad 
            FROM habitaciones h
            JOIN tipos_habitacion t ON h.tipo_id = t.id
            ORDER BY h.numero;
        `);
        return rows;
    },

    async calcularOcupacionPorcentaje() {
        const { rows } = await pool.query(`
            SELECT 
                (COUNT(CASE WHEN estado = 'Ocupada' THEN 1 END)::float / NULLIF(COUNT(*), 0)) * 100 AS porcentaje
            FROM habitaciones;
        `);
        return parseFloat(rows[0].porcentaje) || 0;
    },

    async actualizarEstado(id, estado) {
        const { rows } = await pool.query(
            'UPDATE habitaciones SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id]
        );
        return rows[0] || null;
    }
};

module.exports = HabitacionModel;