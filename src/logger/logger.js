require('dotenv').config();

const winston = require('winston');
const config = require('../sequelize/config');
const {format, transports} = winston;
const logFileName = config.SCELLO_NODE_ENV;


const logger = winston.createLogger({
  level: 'info', // Set the logging level (info, warn, error, etc.)
  format: format.combine(
    format.timestamp(), // Add a timestamp to the logs
    format.printf((info) => {
      const { timestamp, level, message } = info;

      // Colorize log messages based on log level
      const colors = { info: '\x1b[32m', warn: '\x1b[33m', error: '\x1b[31m' };
      const resetColor = '\x1b[0m';

      const colorizedMessage = colors[level] ? `${colors[level]}${message}${resetColor}` : message;

      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: `${logFileName}.log` }) // Log all levels to a file
  ],
});





module.exports = logger;


