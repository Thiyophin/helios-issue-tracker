import winston from 'winston';
import { SeqTransport } from '@datalust/winston-seq';
import env from '../config/env.js';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: 'info',

  format: combine(timestamp(), errors({ stack: true }), json()),

  defaultMeta: {
    service: 'helios-issue-tracker',
  },

  transports: [
    new SeqTransport({
      serverUrl: env.seqUrl,
      handleExceptions: true,
      handleRejections: true,
    }),

    new winston.transports.Console({
      format: combine(colorize(), simple()),
    }),
  ],
});

export default logger;
