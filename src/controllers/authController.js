const pool = require('../config/db'); // <--- Importante para conectar con la BD
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET || 'mi_access_secret_super_seguro';
const SECRET_REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET || 'mi_refresh_secret_super_seguro';

// Generar Access Token (Corta duración: 15 min)
const generarAccessToken = (usuario) => {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET_ACCESS_TOKEN, { expiresIn: '15m' });
};

// Generar Refresh Token (Larga duración: 7 días)
const generarRefreshToken = (usuario) => {
  return jwt.sign({ id: usuario.id }, SECRET_REFRESH_TOKEN, { expiresIn: '7d' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar el usuario real en la base de datos PostgreSQL
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = result.rows[0];

    // 2. Validar la contraseña 
    const passwordValida = password === usuario.password;

    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // 3. Generar los tokens con los datos reales del usuario
    const accessToken = generarAccessToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    return res.json({
      message: 'Inicio de sesión exitoso',
      accessToken,
      usuario: { id: usuario.id, email: usuario.email, rol: usuario.rol }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { login };