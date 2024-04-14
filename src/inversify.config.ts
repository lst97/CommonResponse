import { Container } from "inversify";
import {
  ErrorHandlerService,
  IErrorHandlerService,
} from "./services/ErrorHandlerService";
import { IResponseService, ResponseService } from "./services/ResponseService";
import { ILogService, LogService } from "./services/LogService";
import {
  IMessageCodeService,
  MessageCodeService,
} from "./services/MessageCodeService";
import { DefinedBaseError } from "./models/Errors";
import pino, { Logger } from "pino";

/**
 * For the user to get the singleton instance of the services,
 * Support to use the provided container to build the services.
 * If not provided, it will create a new container for the services.
 * It makes use it use the singleton instance of the services.
 *
 */
export class Containers {
  private static _instance: Containers;
  private _idIdentifier: string;
  private container: Container;

  private constructor() {
    this.container = new Container();
    this.buildContainers();
    this._idIdentifier = "unknown";
  }

  public set idIdentifier(value: string) {
    this._idIdentifier = value;
  }

  public get idIdentifier() {
    return this._idIdentifier;
  }

  public static get instance() {
    if (!Containers._instance) {
      Containers._instance = new Containers();
    }
    return Containers._instance;
  }

  public get inversifyContainer() {
    return this.container;
  }

  private buildContainers() {
    this.buildConstantsContainer();
    this.buildServiceContainer();
  }

  // Arguments that required for the services
  private buildConstantsContainer() {
    // using pino for logging with pretty print by default
    const logger = pino({
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
    this.container.bind<Logger<never>>("Logger").toConstantValue(logger);

    // TODO: user can provide the values
    // path to the message codes json file
    this.container
      .bind<string>("MessageCodesJsonPath")
      .toConstantValue("src/models/MessageCodes.json");

    // error callback for ErrorHandlerService
    this.container
      .bind<(error: DefinedBaseError) => void>("ErrorCallback")
      .toConstantValue((_error: DefinedBaseError) => {});
  }
  private buildServiceContainer() {
    try {
      this.container.get<ILogService>(LogService);
    } catch (e) {
      this.container.bind<ILogService>(LogService).toSelf().inSingletonScope();
    }

    try {
      this.container.get<IMessageCodeService>(MessageCodeService);
    } catch (e) {
      this.container
        .bind<IMessageCodeService>(MessageCodeService)
        .toSelf()
        .inSingletonScope();
    }

    try {
      this.container.get<IErrorHandlerService>(ErrorHandlerService);
    } catch (e) {
      this.container
        .bind<IErrorHandlerService>(ErrorHandlerService)
        .toSelf()
        .inSingletonScope();
    }

    try {
      this.container.get<IResponseService>(ResponseService);
    } catch (e) {
      this.container
        .bind<IResponseService>(ResponseService)
        .toSelf()
        .inSingletonScope();
    }
  }

  public useInversify(container: Container) {
    // use the user provided container to build the middleware containers
    this.container = container;
    this.buildContainers();
  }
}

/**
 * For the user to inject the services into the application.
 *
 * @param container - The user provided container.
 *
 * @example
 * ```typescript
 * import { useInversify } from '@lst97/common_response';
  const container = new Container();
  function buildLibContainers() {
    useInversify(container);
  }
 * ```
 */
export const useInversify = (container: Container) => {
  Containers.instance.useInversify(container);
};

/**
 * For internal use only.
 * @returns the singleton instance of the container
 */
export const inversifyContainer = () => {
  return Containers.instance.inversifyContainer;
};
