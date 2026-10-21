require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // <-- Nuevo para leer cookies seguras
const rateLimit = require('express-rate-limit'); // <-- Nuevo contra ataques de fuerza bruta
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const runMigrations = require('./config/migrate');

const habitacionRoutes = require('./routes/habitacion.routes');
const reservaRoutes = require('./routes/reserva.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configuración de Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP
    message: { error: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.' }
});

//middlewares globales de seguridad
app.use(limiter);
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); // Habilita la lectura de cookies en req.cookies

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas principales MVC
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/reservas', reservaRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API Gestor Hotelero con Yield Management operando correctamente', docs: '/api-docs' });
});

async function start() {
    try {
        await runMigrations(); // Crea tablas y datos automáticos al iniciar
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log(`Swagger Docs en http://localhost:${PORT}/api-docs`);
        });
    } catch (err) {
        console.error('Error al iniciar la aplicación:', err.message);
        process.exit(1);
    }
}

start();