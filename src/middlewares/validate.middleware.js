const { z } = require('zod');

// Esquema de validación para el Login
const loginSchema = z.object({
    email: z.string().email({ message: "Formato de correo electrónico inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

// Esquema de validación para las Reservas (Usando coerce para aceptar strings numéricos del form)
const reservaSchema = z.object({
    cliente_nombre: z.string().min(2, { message: "El nombre del cliente es obligatorio" }),
    cliente_email: z.string().email({ message: "Correo de cliente inválido" }),
    habitacion_id: z.coerce.number().int().positive({ message: "ID de habitación no válido" }),
    fecha_checkin: z.string().min(1, { message: "La fecha de check-in es requerida" }),
    fecha_checkout: z.string().min(1, { message: "La fecha de check-out es requerida" }),
    anticipacion_dias: z.coerce.number().min(0, { message: "Los días de anticipación deben ser un número positivo" }),
    precio_base: z.coerce.number().positive({ message: "El precio base debe ser mayor a 0" })
});

// Middleware de validación ultra-seguro
const validate = (schema) => (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
        // Usamos optional chaining (?.) para evitar cualquier TypeError si errors no existe
        const detalles = resultado.error?.errors?.map(e => e.message) || [resultado.error?.message || "Error de validación desconocido"];
        
        return res.status(400).json({ 
            error: "Datos de entrada inválidos", 
            detalles 
        });
    }

    // Asignamos los datos ya limpios y convertidos por 'coerce'
    req.body = resultado.data; 
    next();
};

module.exports = { loginSchema, reservaSchema, validate };