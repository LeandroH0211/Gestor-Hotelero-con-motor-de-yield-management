const { Router } = require('express');
const HabitacionController = require('../controllers/habitacion.controller');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /api/habitaciones:
 *   get:
 *     summary: Obtener todas las habitaciones y cuartelería
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 */


router.get('/', HabitacionController.getAll);


router.put('/:id/estado', verificarToken, verificarRol(['admin']), HabitacionController.updateStatus);

module.exports = router;