import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } =
  winston.format;

const developmentFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  })
);

const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: "info",

  format:
    process.env.NODE_ENV === "production"
      ? productionFormat
      : developmentFormat,

  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;