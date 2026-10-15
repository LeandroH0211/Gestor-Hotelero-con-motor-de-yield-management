const { Router } = require('express');
const HabitacionController = require('../controllers/habitacion.controller');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Habitacion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         numero:
 *           type: string
 *           example: "101"
 *         tipo:
 *           type: string
 *           example: "Estándar Individual"
 *         precio_base:
 *           type: number
 *           example: 80.00
 *         estado:
 *           type: string
 *           example: "Disponible"
 */

/**
 * @swagger
 * /api/habitaciones:
 *   get:
 *     summary: Obtener todas las habitaciones y cuartelería
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *     <description>: Lista de habitaciones
 */
router.get('/', HabitacionController.getAll);
router.put('/:id/estado', HabitacionController.updateStatus);

module.exports = router;