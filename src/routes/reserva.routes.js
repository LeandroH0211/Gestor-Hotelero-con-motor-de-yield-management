const { Router } = require('express');
const ReservaController = require('../controllers/reserva.controller');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservaInput:
 *       type: object
 *       required:
 *         - cliente_nombre
 *         - cliente_email
 *         - habitacion_id
 *         - fecha_checkin
 *         - fecha_checkout
 *         - anticipacion_dias
 *         - precio_base
 *       properties:
 *         cliente_nombre:
 *           type: string
 *           example: "Ana Gómez"
 *         cliente_email:
 *           type: string
 *           example: "ana@example.com"
 *         habitacion_id:
 *           type: integer
 *           example: 1
 *         fecha_checkin:
 *           type: string
 *           format: date
 *           example: "2026-11-01"
 *         fecha_checkout:
 *           type: string
 *           format: date
 *           example: "2026-11-05"
 *         anticipacion_dias:
 *           type: integer
 *           example: 2
 *         precio_base:
 *           type: number
 *           example: 80.00
 */

router.get('/', ReservaController.getAll);
router.post('/', ReservaController.create);

module.exports = router;