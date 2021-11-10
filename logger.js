const winston = require('winston');
const config = require('config');
module.exports = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: `${config.get('transport')}.log`
        }),
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
    )
});