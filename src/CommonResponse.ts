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
import containers from "./inversify.config";
import { inject, injectable } from "inversify";

// /**
//  * The CommonResponseContainer class acts as a container that encapsulates all necessary dependencies for handling common responses within a TypeScript application.
//  * This design pattern ensures that all services related to logging, error handling, message code retrieval, and response building are centralized and easily accessible through a single instance.
//  * By providing a unified access point for these services, it simplifies the management of common tasks such as logging errors, handling exceptions, retrieving message codes for responses, and constructing success or error responses.
//  */
// class CommonResponseContainer {
//   private static _instance: CommonResponseContainer;

//   public logService: ILogService;
//   public errorHandlerService: IErrorHandlerService;
//   public messageCodeService: IMessageCodeService;
//   public responseService: IResponseService;

//   private constructor(
//     logService: ILogService,
//     errorHandlerService: IErrorHandlerService,
//     messageCodeService: IMessageCodeService,
//     responseService: IResponseService
//   ) {
//     this.logService = logService;
//     this.errorHandlerService = errorHandlerService;
//     this.messageCodeService = messageCodeService;
//     this.responseService = responseService;
//   }

//   public static get instance(): CommonResponseContainer {
//     if (!CommonResponseContainer._instance) {
//       const logService = new LogService();
//       const errorHandlerService = new ErrorHandlerService(logService);
//       const messageCodeService = new MessageCodeService(logService);
//       const responseService = new ResponseService(
//         errorHandlerService,
//         messageCodeService
//       );
//       CommonResponseContainer._instance = new CommonResponseContainer(
//         logService,
//         errorHandlerService,
//         messageCodeService,
//         responseService
//       );
//     }
//     return CommonResponseContainer._instance;
//   }
// }
export interface ICommonResponse {
  LogService: ILogService;
  ErrorHandlerService: IErrorHandlerService;
  MessageCodeService: IMessageCodeService;
  ResponseService: IResponseService;
}
@injectable()
export class CommonResponse {
  constructor() {}

  public get LogService() {
    return containers.inversifyContainer.get<ILogService>(LogService);
  }

  public get ErrorHandlerService() {
    return containers.inversifyContainer.get<IErrorHandlerService>(
      ErrorHandlerService,
    );
  }

  public get MessageCodeService() {
    return containers.inversifyContainer.get<IMessageCodeService>(
      MessageCodeService,
    );
  }

  public get ResponseService() {
    return containers.inversifyContainer.get<IResponseService>(ResponseService);
  }
}

// Incase for testing individual services
// export const logService =
//   containers.inversifyContainer.get<ILogService>("LogService");
// export const errorHandlerService =
//   containers.inversifyContainer.get<IErrorHandlerService>(
//     "ErrorHandlerService"
//   );
// export const messageCodeService =
//   containers.inversifyContainer.get<IMessageCodeService>("MessageCodeService");
// export const responseService =
//   containers.inversifyContainer.get<IResponseService>("ResponseService");
