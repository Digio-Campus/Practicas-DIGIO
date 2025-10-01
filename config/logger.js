const winston = require('winston');
const path = require('path');

// Define los niveles de log personalizados
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define los colores para cada nivel
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Añade los colores a winston
winston.addColors(colors);

// Define el formato de los logs
const format = winston.format.combine(
    // Añade el timestamp
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Añade colores
    winston.format.colorize({ all: true }),
    // Define el formato del mensaje
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

// Define las configuraciones de transporte
const transports = [
    // Logs de consola
    new winston.transports.Console(),
    // Logs de errores en archivo
    new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
    }),
    // Todos los logs en archivo
    new winston.transports.File({
        filename: path.join('logs', 'all.log'),
    }),
];

// Crea el logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    format,
    transports,
});

module.exports = logger;