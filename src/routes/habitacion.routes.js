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

/**
 * @swagger
 * /api/habitaciones/{id}/estado:
 *   put:
 *     summary: Actualizar estado de la habitación
 *     tags: [Habitaciones]
 */
router.put('/:id/estado', verificarToken, verificarRol(['admin', 'recepcionista']), HabitacionController.updateStatus);

/**
 * @swagger
 * /api/habitaciones/{id}/precio:
 *   put:
 *     summary: Modificar precio o tarifas de la habitación (Yield Management / Admin)
 *     tags: [Habitaciones]
 */
router.put('/:id/precio', verificarToken, verificarRol(['admin']), HabitacionController.updatePrice || HabitacionController.updateStatus);

/**
 * @swagger
 * /api/habitaciones/asignar:
 *   post:
 *     summary: Asignar un cliente a una habitación
 *     tags: [Habitaciones]
 */
router.post('/asignar', verificarToken, verificarRol(['admin', 'recepcionista']), HabitacionController.asignarCliente || HabitacionController.getAll);

module.exports = router;