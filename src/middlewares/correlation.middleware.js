const crypto = require('crypto');

const correlationMiddleware = (req, res, next) => {
    // Si el cliente envía un ID de correlación lo usamos, si no, generamos uno nuevo nativo
    const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
    
    // Lo adjuntamos al objeto request para usarlo en los logs y controladores
    req.correlationId = correlationId;
    
    // Lo devolvemos en las cabeceras de la respuesta para el cliente
    res.setHeader('x-correlation-id', correlationId);
    
    next();
};

module.exports = correlationMiddleware;