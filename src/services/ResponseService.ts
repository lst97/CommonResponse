import { Response } from "express";
import { Service } from "typedi";
import BackendStandardResponse, { ResponseMessage } from "../models/Response";
import ErrorHandlerService from "../services/ErrorHandlerService";
import { MessageCodeService } from "./MessageCodeService";
import DefinedBaseError, {
  DatabaseError,
  ServerError,
  SqlRecordExistsError,
  SqlRecordNotFoundError,
} from "../models/Errors";

@Service()
class ResponseService {
  constructor(
    private errorHandlerService: ErrorHandlerService,
    private messageCodeService: MessageCodeService
  ) {}
  /**
   * Sends an error response to the client.
   * @param res - The Express response object.
   * @param error - The error object that occurred.
   * @param requestId - A unique identifier for the request.
   * @param httpStatus - The HTTP status code for the response. Defaults to 500 if not provided.
   * @returns The Express response object with the error response sent to the client.
   */
  public sendError(
    res: Response,
    error: Error,
    requestId: string,
    httpStatus: number = 500
  ): Response<any, Record<string, any>> {
    let message: ResponseMessage | null = null;
    let traceId = "";

    if (!(error instanceof DefinedBaseError)) {
      this.errorHandlerService.handleUnknownError({
        error: error as Error,
        service: ResponseService.name,
      });
    } else {
      const rootCause = this.errorHandlerService.getDefinedBaseError(
        error.traceId
      )!;

      message = new ResponseMessage(
        rootCause.messageCode,
        rootCause.userMessage
      );

      traceId = rootCause.traceId;

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
        this.messageCodeService.Messages.Common.OperationFail.Message
      );
    }

    const response = new BackendStandardResponse({
      status: "error",
      message: message!,
      requestId,
      traceId,
    });

    return res.status(httpStatus).json(response);
  }

  /**
   * Sends a successful response to the client with the provided data.
   * @param res - The Express response object.
   * @param data - The data to be sent in the response.
   * @param requestId - A unique identifier for the request.
   * @param status - The HTTP status code for the response. (default: 200)
   * @returns The Express response object with the successful response sent to the client.
   */
  public sendSuccess(
    res: Response,
    data: any,
    requestId: string,
    status: number = 200
  ): Response<any, Record<string, any>> {
    const response = new BackendStandardResponse({
      status: "success",
      message: new ResponseMessage(
        this.messageCodeService.Messages.Common.OperationSuccess.Code,
        this.messageCodeService.Messages.Common.OperationSuccess.Message
      ),
      data,
      requestId,
    });

    return res.status(status).json(response);
  }
}

export default ResponseService;
