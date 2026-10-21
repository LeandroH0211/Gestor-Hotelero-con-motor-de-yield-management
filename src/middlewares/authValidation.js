const Joi = require('joi');

// Esquema de validación para el registro o login
const schemaAuth = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico debe ser válido',
    'any.required': 'El correo es obligatorio'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es obligatoria'
  })
});

const validarAuth = (req, res, next) => {
  const { error } = schemaAuth.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validarAuth };