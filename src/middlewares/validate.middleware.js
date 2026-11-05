const { z } = require('zod');

// Esquema de validación para el Login
const loginSchema = z.object({
    email: z.string().email({ message: "Formato de correo electrónico inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

// Esquema de validación para las Reservas
const reservaSchema = z.object({
    cliente_nombre: z.string().min(2, { message: "El nombre del cliente es obligatorio" }),
    cliente_email: z.string().email({ message: "Correo de cliente inválido" }),
    habitacion_id: z.number().int().positive({ message: "ID de habitación no válido" }),
    fecha_checkin: z.string().min(1, { message: "La fecha de check-in es requerida" }),
    fecha_checkout: z.string().min(1, { message: "La fecha de check-out es requerida" }),
    anticipacion_dias: z.number().min(0, { message: "Los días de anticipación deben ser un número positivo" })
});

// Middleware de validación
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ 
            error: "Datos de entrada inválidos", 
            detalles: error.errors.map(e => e.message) 
        });
    }
};

module.exports = { loginSchema, reservaSchema, validate };