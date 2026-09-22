import winston from 'winston';
import 'winston-mongodb';
import env from '../config/env.js';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: 'info',

  format: combine(timestamp(), errors({ stack: true }), json()),

  transports: [
    // MongoDB logs
    new winston.transports.MongoDB({
      db: env.mongoUri,
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
