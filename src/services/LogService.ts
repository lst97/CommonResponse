import pino from "pino";
import { Service } from "typedi";

@Service()
export class LogService {
  public logger: any;
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

  private getLogger() {
    return pino({
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
  }
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
