const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, loginSchema } = require('../middlewares/validate.middleware'); 

// Ruta final: POST /api/auth/login con validación de Zod
router.post('/login', validate(loginSchema), authController.login); 

module.exports = router;