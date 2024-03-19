import {
  ErrorHandlerService,
  IErrorHandlerService,
} from "./services/ErrorHandlerService";
import {
  IMessageCodeService,
  MessageCodeService,
} from "./services/MessageCodeService";
import { ILogService, LogService } from "./services/LogService";
import { IResponseService, ResponseService } from "./services/ResponseService";

/**
 * The CommonResponseContainer class acts as a container that encapsulates all necessary dependencies for handling common responses within a TypeScript application.
 * This design pattern ensures that all services related to logging, error handling, message code retrieval, and response building are centralized and easily accessible through a single instance.
 * By providing a unified access point for these services, it simplifies the management of common tasks such as logging errors, handling exceptions, retrieving message codes for responses, and constructing success or error responses.
 */
class CommonResponseContainer {
  private static _instance: CommonResponseContainer;

  public logService: ILogService;
  public errorHandlerService: IErrorHandlerService;
  public messageCodeService: IMessageCodeService;
  public responseService: IResponseService;

  private constructor(
    logService: ILogService,
    errorHandlerService: IErrorHandlerService,
    messageCodeService: IMessageCodeService,
    responseService: IResponseService
  ) {
    this.logService = logService;
    this.errorHandlerService = errorHandlerService;
    this.messageCodeService = messageCodeService;
    this.responseService = responseService;
  }

  public static get instance(): CommonResponseContainer {
    if (!CommonResponseContainer._instance) {
      const logService = new LogService();
      const errorHandlerService = new ErrorHandlerService(logService);
      const messageCodeService = new MessageCodeService(logService);
      const responseService = new ResponseService(
        errorHandlerService,
        messageCodeService
      );
      CommonResponseContainer._instance = new CommonResponseContainer(
        logService,
        errorHandlerService,
        messageCodeService,
        responseService
      );
    }
    return CommonResponseContainer._instance;
  }
}

export const logService = CommonResponseContainer.instance.logService;
export const errorHandlerService =
  CommonResponseContainer.instance.errorHandlerService;
export const messageCodeService =
  CommonResponseContainer.instance.messageCodeService;
export const responseService = CommonResponseContainer.instance.responseService;
