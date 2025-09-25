import path from 'path';
import winston, { createLogger, format, transports } from 'winston';
import fs from 'fs-extra';

interface LoggerOpts {
  level?: string;
  serviceName?: string;
  consoleOutput?: boolean;
  fileOutput?: boolean;
  logFilePath?: string;
  jsonFormat?: boolean;
}

/**
 * Metadata type for logging
 */
interface LogMetadata {
  [key: string]: any;
}

class Logger {
  #instance: winston.Logger;

  constructor(options: LoggerOpts = {}) {
    const {
      level = 'info',
      serviceName = 'api',
      consoleOutput = true,
      fileOutput = false,
      logFilePath = `${process.cwd()}/logs/app.log`,
      jsonFormat = false,
    } = options;

    // Define custom format
    const customFormat = format.printf(
      ({ level, message, timestamp, ...metadata }) => {
        return `[${timestamp}] [${level}] [${serviceName}]: ${message} ${
          Object.keys(metadata).length ? JSON.stringify(metadata) : ''
        }`;
      }
    );
    // Create format based on options
    let selectedFormat;
    if (jsonFormat) {
      selectedFormat = format.combine(format.timestamp(), format.json());
    } else {
      selectedFormat = format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      );
    }

    // Configure transports
    const logTransports: winston.transport[] = [];

    if (consoleOutput) {
      logTransports.push(new transports.Console());
    }

    if (fileOutput) {
      const logDir = path.dirname(logFilePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      logTransports.push(
        new transports.File({
          filename: logFilePath,
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          tailable: true,
        })
      );
    }

    // Create the logger
    this.#instance = createLogger({
      level,
      format: selectedFormat,
      transports: logTransports,
      exitOnError: false,
    });
  }

  /**
   * Log with error level
   * @param message - Log message
   * @param metadata - Additional metadata
   */
  error(message: string, metadata: LogMetadata = {}): void {
    this.#instance.error(message, metadata);
  }

  /**
   * Log with warn level
   * @param message - Log message
   * @param metadata - Additional metadata
   */
  warn(message: string, metadata: LogMetadata = {}): void {
    this.#instance.warn(message, metadata);
  }

  /**
   * Log with info level
   * @param message - Log message
   * @param metadata - Additional metadata
   */
  info(message: string, metadata: LogMetadata = {}): void {
    this.#instance.info(message, metadata);
  }

  /**
   * Log with debug level
   * @param message - Log message
   * @param metadata - Additional metadata
   */
  debug(message: string, metadata: LogMetadata = {}): void {
    this.#instance.debug(message, metadata);
  }
}

export const logger = new Logger({ fileOutput: true });
