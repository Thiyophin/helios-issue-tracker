import winston from 'winston';
import 'winston-mongodb';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: 'info',

  format: combine(timestamp(), errors({ stack: true }), json()),

  transports: [
    // MongoDB logs
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: 'logs',
      level: 'info',
      storeHost: true,
    }),

    // Terminal logs during development
    new winston.transports.Console({
      format: combine(colorize(), simple()),
    }),
  ],
});

export default logger;
