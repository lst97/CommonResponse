import { BackendStandardResponse, ResponseMessage } from "../models/Response";
import {
  ErrorHandlerService,
  IErrorHandlerService,
} from "../services/ErrorHandlerService";
import { IMessageCodeService, MessageCodeService } from "./MessageCodeService";
import {
  DefinedBaseError,
  DatabaseError,
  ServerError,
  SqlRecordExistsError,
  SqlRecordNotFoundError,
} from "../models/Errors";
import { injectable } from "inversify";
import { inversifyContainer } from "../inversify.config";

/**
 * The ResponseService class is responsible for building response objects based on provided errors,
 * request IDs, and HTTP statuses. It handles both known and unknown errors, constructs response messages, and creates instances of the BackendStandardResponse class.
 */
export interface IResponseService {
  /**
   * Builds an error response based on the provided error, request ID, and HTTP status.
   * If the error is an instance of DefinedBaseError, it retrieves the root cause error
   * and constructs a response message based on it. Otherwise, it handles the unknown error.
   * If the error is an instance of ServerError or DatabaseError (excluding SqlRecordNotFoundError
   * and SqlRecordExistsError), or if no message is available, a default error message is used.
   * The response includes the status, message, request ID, and trace ID.
   *
   * @param error - The error object.
   * @param requestId - The ID of the request.
   * @param httpStatus - The HTTP status code (default: 500).
   * @returns The built CommonResponse object containing the HTTP status and response.
   */
  buildErrorResponse(
    error: Error,
    requestId: string,
    httpStatus?: number,
  ): CommonResponse;

  /**
   * Builds a success response object.
   * @param data - The data to be included in the response.
   * @param requestId - The unique identifier for the request.
   * @param httpStatus - The HTTP status code for the response (default: 200).
   * @returns The built success response object.
   */
  buildSuccessResponse(
    data: any,
    requestId: string,
    httpStatus?: number,
  ): CommonResponse;
}

/**
 * Represents a common response object.
 * @template T - The type of the `response` property, type should be same as data.
 */
interface CommonResponse {
  httpStatus: number;
  response: BackendStandardResponse<any>;
}

/**
 * The ResponseService class is responsible for building response objects based on provided errors,
 * request IDs, and HTTP statuses. It handles both known and unknown errors, constructs response messages, and creates instances of the BackendStandardResponse class.
 *
 * @implements {IResponseService}
 * @remark Don't create an instance of this class directly. Use the `ResponseServiceInstance` function to get the singleton instance.
 * @remark Only use this class for DI injection identifier.
 */
@injectable()
export class ResponseService implements IResponseService {
  private errorHandlerService: IErrorHandlerService;
  private messageCodeService: IMessageCodeService;
  constructor() {
    this.errorHandlerService =
      inversifyContainer().get<IErrorHandlerService>(ErrorHandlerService);
    this.messageCodeService =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService);
  }

  /**
   * Builds an error response based on the provided error, request ID, and HTTP status.
   * If the error is an instance of DefinedBaseError, it retrieves the root cause error
   * and constructs a response message based on it. Otherwise, it handles the unknown error.
   * If the error is an instance of ServerError or DatabaseError (excluding SqlRecordNotFoundError
   * and SqlRecordExistsError), or if no message is available, a default error message is used.
   * The response includes the status, message, request ID, and trace ID.
   *
   * @param error - The error object.
   * @param requestId - The ID of the request.
   * @param httpStatus - The HTTP status code (default: 500).
   * @returns The built CommonResponse object containing the HTTP status and response.
   */
  public buildErrorResponse(
    error: Error,
    requestId: string,
    httpStatus: number = 500,
  ): CommonResponse {
    let message: ResponseMessage | null = null;
    let traceId = "";

    if (!(error instanceof DefinedBaseError)) {
      this.errorHandlerService.handleUnknownError({
        error: error as Error,
        service: ResponseService.name,
      });
    } else {
      const rootCause = this.errorHandlerService.getDefinedBaseError(
        error.traceId,
      )!;

      if (rootCause != null) {
        message = new ResponseMessage(
          rootCause.messageCode,
          rootCause.userMessage,
        );

        traceId = rootCause.traceId;
      } else {
        message = new ResponseMessage(error.messageCode, error.userMessage);

        traceId = error.traceId;
      }

      httpStatus = error.httpStatus;
    }

    if (
      error instanceof ServerError ||
      (error instanceof DatabaseError &&
        !(
          error instanceof SqlRecordNotFoundError ||
          error instanceof SqlRecordExistsError
        )) ||
      !message
    ) {
      message = new ResponseMessage(
        this.messageCodeService.Messages.Common.OperationFail.Code,
        this.messageCodeService.Messages.Common.OperationFail.Message,
      );
    }

    const response = new BackendStandardResponse({
      status: "error",
      message: message!,
      requestId,
      traceId,
    });

    this.errorHandlerService.removeErrorFromChain(traceId);
    return { httpStatus: httpStatus, response: response };
  }

  /**
   * Builds a success response object.
   * @param data - The data to be included in the response.
   * @param requestId - The unique identifier for the request.
   * @param httpStatus - The HTTP status code for the response (default: 200).
   * @returns The built success response object.
   */
  public buildSuccessResponse(
    data: any,
    requestId: string,
    httpStatus: number = 200,
  ): CommonResponse {
    const response = new BackendStandardResponse({
      status: "success",
      message: new ResponseMessage(
        this.messageCodeService.Messages.Common.OperationSuccess.Code,
        this.messageCodeService.Messages.Common.OperationSuccess.Message,
      ),
      data,
      requestId,
    });

    return { httpStatus: httpStatus, response: response };
  }
}

/**
 * Returns the singleton instance of the ResponseService class.
 * @returns The singleton instance of the ResponseService class.
 */
export const ResponseServiceInstance = () => {
  return inversifyContainer().get<IResponseService>(ResponseService);
};
