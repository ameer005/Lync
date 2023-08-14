import { config } from "../global/config";
import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "cyan",
  debug: "white",
};

const level = config.https.isProduction ? "warn" : "debug";

winston.addColors(colors);

const logger = winston.createLogger({
  level: level,
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // new winston.transports.File({ filename: "logs/all.log" }),
  ],
});

export default logger;
