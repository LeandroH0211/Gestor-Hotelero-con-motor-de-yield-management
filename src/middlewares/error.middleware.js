const errorHandler = (err, req, res, next) => {
    // Capturamos el código de estado o por defecto 500
    const statusCode = err.statusCode || 500;
    
    // Logueamos el error en la terminal del servidor incluyendo el Correlation ID para trazabilidad
    console.error(`[${req.correlationId}] ❌ Error crítico:`, {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Respuesta JSON estandarizada y limpia hacia el frontend
    res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode,
            message: err.message || 'Error interno del servidor',
            correlationId: req.correlationId 
        }
    });
};

module.exports = errorHandler;