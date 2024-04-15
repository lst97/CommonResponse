import { Config } from "../CommonResponse.config";
import { DefinedBaseError, ServerError, TestError } from "@lst97/common-errors";
import {
  ErrorHandlerService,
  IErrorHandlerService,
  TestErrorLogStrategy,
} from "../services/ErrorHandlerService";
import { inversifyContainer } from "../inversify.config";
describe("ErrorHandlerService", () => {
  let errorHandlerService: IErrorHandlerService;

  beforeEach(() => {
    Config.instance.idIdentifier = "mock_identifier_ErrorHandlerService";
    Config.instance.requestIdName = "requestId_test";
    Config.instance.traceIdName = "traceId_test";

    errorHandlerService =
      inversifyContainer().get<IErrorHandlerService>(ErrorHandlerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log and add error to the chain when error of type DefinedBaseError is passed", () => {
    // Arrange
    const error = new DefinedBaseError("Example error", 500, "EXAMPLE_ERROR");
    const service = "ExampleService";

    // Act
    errorHandlerService.handleError({ error, service });

    // Assert
    expect(errorHandlerService.getDefinedBaseError(error.traceId)).toEqual(
      error,
    );
  });

  it("should add cause to the error chain when error of type DefinedBaseError with cause is passed", () => {
    // Arrange
    const causeError = new Error("Cause error");

    const error_bummock = new DefinedBaseError(
      "Example error [1]",
      500,
      "EXAMPLE_ERROR [1]",
    );
    error_bummock.cause = causeError;
    const error_hummock = new DefinedBaseError(
      "Example error [2]",
      500,
      "EXAMPLE_ERROR [2]",
    );
    error_hummock.cause = error_bummock;

    const service = "ExampleService";

    // Act
    errorHandlerService.handleError({ error: error_hummock, service });

    // Assert
    expect(
      errorHandlerService.getDefinedBaseError(error_hummock.traceId)?.cause,
    ).toEqual(error_bummock);
    expect(errorHandlerService.getRootCause(error_hummock.traceId)).toEqual(
      causeError,
    );
  });

  it("should create and add ServerError to the error chain when error of type DefinedBaseError is not passed", () => {
    // Arrange
    const genericError = new Error("Unhandled error");
    const service = "ExampleService";

    // Act
    const traceId = errorHandlerService.handleError({
      error: genericError,
      service,
    });

    // Assert
    const serverError = errorHandlerService.getDefinedBaseError(traceId);
    expect(serverError).toBeInstanceOf(ServerError);
    expect(serverError?.cause).toEqual(genericError);
  });

  it("should remove the error from the chain", () => {
    // Arrange
    const error = new DefinedBaseError("Example error", 500, "EXAMPLE_ERROR");
    const service = "ExampleService";
    errorHandlerService.handleError({ error, service });

    // Act
    errorHandlerService.removeErrorFromChain(error.traceId);

    // Assert
    expect(errorHandlerService.getDefinedBaseError(error.traceId)).toBeNull();
  });

  it("should include the test in the log message when it is present in the error instance", () => {
    const error = new TestError({
      message: "Test failed",
      messageCode: "TEST",
      test: "This is a test field",
    });

    const logStrategy = new TestErrorLogStrategy();
    const logMessage = logStrategy.getLogMessage(error);

    expect(logMessage).toContain("test: This is a test field");
  });
});
