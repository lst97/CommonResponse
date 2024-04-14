import { IResponseService, ResponseService } from "../services/ResponseService";
import { ServerError } from "../models/Errors";
import { inversifyContainer } from "../inversify.config";
import { Config } from "../CommonResponse.config";
import { IBackendStandardResponse } from "@lst97/common-response-structure";

describe("ResponseService", () => {
  let responseService: IResponseService;
  beforeEach(() => {
    Config.instance.idIdentifier = "mock_identifier_ResponseService";
    Config.instance.requestIdName = "requestId_test";
    Config.instance.traceIdName = "traceId_test";

    responseService =
      inversifyContainer().get<IResponseService>(ResponseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error response object with status 'error' and a message object when given an error object and a request ID", () => {
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
          (response as any).response as IBackendStandardResponse<undefined>
        ).timestamp,
        traceId: (
          (response as any).response as IBackendStandardResponse<undefined>
        ).traceId,
        version: "1.0",
        warnings: undefined,
      },
    });
  });
});
