import * as winston from 'winston';
import * as path from 'path';

// Resolve log directory path (use env var or fallback to relative path)
const logDir =
  process.env.LOG_DIR || path.resolve(process.cwd(), '../../yoyimmo-data/logs');

export const winstonConfig = {
  transports: [
    // Console transport (JSON format)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // Error log file with rotation
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // Combined log file with rotation
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
