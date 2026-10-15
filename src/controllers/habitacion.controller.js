const HabitacionModel = require('../models/habitacion.model');

const HabitacionController = {
    async getAll(req, res) {
        try {
            const habitaciones = await HabitacionModel.findAll();
            const ocupacion = await HabitacionModel.calcularOcupacionPorcentaje();
            res.json({ success: true, ocupacion_actual: `${ocupacion}%`, data: habitaciones });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { estado } = req.body;
            const habitacion = await HabitacionModel.actualizarEstado(req.params.id, estado);
            if (!habitacion) return res.status(404).json({ success: false, message: 'Habitación no encontrada' });
            res.json({ success: true, data: habitacion });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};

module.exports = HabitacionController;