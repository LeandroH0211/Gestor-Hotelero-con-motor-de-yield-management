const pool = require('../config/db'); 
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

    // 2. Validar la contraseña usando bcrypt.compare
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // 3. Generar los tokens
    const accessToken = generarAccessToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    // Guardar el Refresh Token en la BD (esto revoca sesiones concurrentes anteriores)
    await pool.query('UPDATE usuarios SET refresh_token = $1 WHERE id = $2', [refreshToken, usuario.id]);

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

// 4. Endpoint para manejar la rotación y revocación del Refresh Token
const refreshTokenEndpoint = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);

  const incomingRefreshToken = cookies.refreshToken;

  try {
    // Verificar si el refresh token coincide con el registrado en la base de datos
    const result = await pool.query('SELECT * FROM usuarios WHERE refresh_token = $1', [incomingRefreshToken]);
    
    if (result.rows.length === 0) {
      // Posible robo de token o reutilización detectada: Revocar seguridad
      return res.status(403).json({ error: 'Token de refresco inválido o ya utilizado (Sesión revocada)' });
    }

    const usuario = result.rows[0];

    jwt.verify(incomingRefreshToken, SECRET_REFRESH_TOKEN, async (err, decoded) => {
      if (err || usuario.id !== decoded.id) return res.sendStatus(403);

      // Rotación: Generar nuevos tokens
      const newAccessToken = generarAccessToken(usuario);
      const newRefreshToken = generarRefreshToken(usuario);

      // Actualizar el nuevo Refresh Token en la base de datos
      await pool.query('UPDATE usuarios SET refresh_token = $1 WHERE id = $2', [newRefreshToken, usuario.id]);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Error en refreshToken:', error);
    return res.sendStatus(500);
  }
};

module.exports = { login, refreshTokenEndpoint };