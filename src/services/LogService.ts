import pino from "pino";
/**
 * LogService class provides logging functionality using the pino library.
 * It allows setting a custom service name and provides methods for logging error, info, warn, and debug messages.
 *
 * @class LogService
 * @internal This class should not be used outside of the CommonResponse module.
 */
export interface ILogService {
  Logger: any;
  setServiceName(service: string): void;
  error(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
}

/**
 * LogService class provides logging functionality using the pino library.
 * It allows setting a custom service name and provides methods for logging error, info, warn, and debug messages.
 *
 * @class LogService
 * @internal This class should not be used outside of the CommonResponse module.
 */
export class LogService {
  private logger: any;
  public get Logger(): any {
    return this.logger;
  }

  private serviceName: string;

  constructor(logger?: any) {
    // If logger is provided, use it
    if (logger) {
      this.logger = logger;
    } else {
      // Pino pretty configuration: https://getpino.io/#/docs/pretty
      this.logger = pino({
        level: process.env.LOG_LEVEL || "info",
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss o",
          },
        },
      });

      if (this.logger === undefined) {
        throw new Error("Logger not created");
      }
    }

    this.serviceName = "default";
  }

  /**
   * Sets the service name to be included in log messages.
   *
   * @param service - The name of the service.
   * @throws Error if an empty or invalid service name is provided.
   */
  public setServiceName(service: string): void {
    if (service && service.trim() !== "") {
      this.serviceName = service;
    } else {
      throw new Error("Invalid service name");
    }
  }

  public error(message: string): void {
    if (message && message.trim() !== "") {
      this.logger.error({ service: this.serviceName }, message);
    }
  }

  public info(message: string): void {
    if (message && message.trim() !== "") {
      this.logger.info({ service: this.serviceName }, message);
    }
  }

  public warn(message: string): void {
    if (message && message.trim() !== "") {
      this.logger.warn({ service: this.serviceName }, message);
    }
  }

  public debug(message: string): void {
    if (message && message.trim() !== "") {
      this.logger.debug({ service: this.serviceName }, message);
    }
  }
}
