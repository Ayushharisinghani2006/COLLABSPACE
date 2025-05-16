const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
    new winston.transports.Console(),
    // Placeholder for remote logging (e.g., to a service like AWS CloudWatch)
    // new winston.transports.Http({ host: 'logs.example.com', port: 443 }),
  ],
});

module.exports = logger;