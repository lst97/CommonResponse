import { IResponseService } from "../services/ResponseService";
import { ServerError } from "../models/Errors";
import { BackendStandardResponse } from "../models/Response";
import containers from "../inversify.config";
import { CommonResponse, ICommonResponse } from "../CommonResponse";
describe("ResponseService", () => {
  let responseService: IResponseService;
  beforeEach(() => {
    responseService =
      containers.inversifyContainer.get<ICommonResponse>(
        CommonResponse,
      ).ResponseService;
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
