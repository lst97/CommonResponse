import { Container } from "inversify";
import {
  ErrorHandlerService,
  IErrorHandlerService,
} from "./services/ErrorHandlerService";
import { IResponseService, ResponseService } from "./services/ResponseService";
import { ILogService, LogService, usePino } from "./services/LogService";
import {
  IMessageCodeService,
  MessageCodeService,
} from "./services/MessageCodeService";
import { DefinedBaseError } from "./models/Errors";
import { CommonResponse, ICommonResponse } from "./CommonResponse";
import pino, { Logger } from "pino";

/**
 * For the user to get the singleton instance of the services,
 * Support to use the provided container to build the services.
 * If not provided, it will create a new container for the services.
 * It makes use it use the singleton instance of the services.
 *
 */
export class Containers {
  private container: Container;

  constructor() {
    this.container = new Container();
    this.buildContainers();
  }

  public get inversifyContainer() {
    return this.container;
  }

  private buildContainers() {
    this.buildConstantsContainer();
    this.buildServiceContainer();
  }

  // Arguments that required for the services
  public buildConstantsContainer() {
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

    try {
      this.container.get<ICommonResponse>(CommonResponse);
    } catch (e) {
      this.container
        .bind<ICommonResponse>(CommonResponse)
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

const containers = new Containers();
export default containers;
