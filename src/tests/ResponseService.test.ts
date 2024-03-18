import Container from "typedi";
import { MessageCodeService } from "../services/MessageCodeService";
import { LogService } from "../services/LogService";
import { ErrorHandlerService } from "../services/ErrorHandlerService";
import { ResponseService } from "../services/ResponseService";
import { ServerError } from "../models/Errors";
import { BackendStandardResponse } from "../models/Response";

describe("ResponseService", () => {
  let responseService: ResponseService;

  beforeEach(() => {
    Container.set(LogService, new LogService());
    Container.set(
      MessageCodeService,
      new MessageCodeService(Container.get(LogService)),
    );
    Container.set(
      ErrorHandlerService,
      new ErrorHandlerService(Container.get(LogService)),
    );

    responseService = new ResponseService(
      Container.get(ErrorHandlerService),
      Container.get(MessageCodeService),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error response object with status 'error' and a message object when given an error object and a request ID", () => {
    const responseService = new ResponseService(
      Container.get(ErrorHandlerService),
      Container.get(MessageCodeService),
    );

    const error = new ServerError({
      message: "Internal server error",
      messageCode: "500",
      cause: new Error("Something went wrong"),
    });

    const requestId = "123456789";
    const httpStatus = 500;

    const response = responseService.buildErrorResponse(
      error,
      requestId,
      httpStatus,
    );

    expect(response).toEqual({
      httpStatus: 500,
      response: {
        data: undefined,
        message: { code: "FAILED", message: "Internal server error occurred" },
        metadata: undefined,
        pagination: undefined,
        requestId: "123456789",
        result: undefined,
        status: "error",
        timestamp: (
          (response as any).response as BackendStandardResponse<undefined>
        ).timestamp,
        traceId: (
          (response as any).response as BackendStandardResponse<undefined>
        ).traceId,
        version: "1.0",
        warnings: undefined,
      },
    });
  });
});
