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

    const usuarioSimulado = { id: 1, email, rol: 'admin' };


    const accessToken = generarAccessToken(usuarioSimulado);
    const refreshToken = generarRefreshToken(usuarioSimulado);


    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });


    return res.json({
      message: 'Inicio de sesión exitoso',
      accessToken,
      usuario: { id: usuarioSimulado.id, email: usuarioSimulado.email, rol: usuarioSimulado.rol }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { login };