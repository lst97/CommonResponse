import { injectable } from "inversify";
import {
  DefinedBaseError,
  ClientAuthError,
  ControllerError,
  DatabaseError,
  ServerError,
  ServiceError,
  TestError,
} from "@lst97/common-errors";
import { Request } from "express";
import { inversifyContainer } from "../inversify.config";
import { ILogService, LogService } from "@lst97/common-services";

/**
 * The `ErrorHandlerService` class is responsible for handling and logging errors in a Node.js application.
 * It provides methods to handle different types of errors, add them to an error chain, and retrieve the root cause of an error based on its trace ID.
 *
 * Example Usage:
 * ```javascript
 * // Create an instance of ErrorHandlerService
 * const errorHandler = new ErrorHandlerService();
 *
 * // Handle a defined base error
 * const definedBaseError = new DefinedBaseError("An error occurred", 500, "ERROR_CODE");
 * errorHandler.handleError({ error: definedBaseError, service: "UserService" });
 *
 * // Handle an unknown error
 * const unknownError = new Error("Unknown error occurred");
 * errorHandler.handleUnknownError({ error: unknownError, service: "UserService" });
 * ```
 *
 * Main functionalities:
 * - Handles and logs different types of errors in a Node.js application
 * - Adds errors to an error chain and retrieves the root cause of an error
 * - Provides methods to handle unknown database, service, controller, and server errors
 *
 * Methods:
 * - `removeErrorFromChain(traceId: string): void`: Removes an error from the error chain based on its trace ID.
 * - `log(error: Error): void`: Logs the error using the appropriate log strategy.
 * - `getLogStrategy(error: DefinedBaseError): LogStrategy`: Returns the appropriate log strategy based on the error type.
 * - `_handleError<T extends DefinedBaseError>(error: T): void`: Handles the error by adding it to the error chain and logging it.
 * - `getDefinedBaseError(traceId: string): DefinedBaseError | null`: Retrieves the root base error from the error chain based on the trace ID.
 * - `getRootCause(traceId: string): Error | null`: Retrieves the root cause of an error based on the provided trace ID.
 * - `handleError(params: HandleErrorParams): string`: Handles the error and returns the trace ID.
 * - `handleUnknownDatabaseError(params: HandleUnknownDatabaseErrorParams): DatabaseError`: Handles unknown database errors.
 * - `handleUnknownServiceError(params: HandleUnknownServiceErrorParams): ServiceError`: Handles unknown service errors.
 * - `handleUnknownControllerError(params: HandleUnknownControllerErrorParams): ControllerError`: Handles unknown controller errors.
 * - `handleUnknownServerError(params: HandleUnknownServerErrorParams): ServerError`: Handles unknown server errors.
 * - `handleUnknownError(params: HandleUnknownErrorParams): void`: Handles unknown errors.
 *
 * Fields:
 * - `errorChains: Map<string, DefinedBaseError>`: A map that stores the error chain, where the key is the trace ID and the value is the root base error.
 * - `onErrorCallback?: (error: DefinedBaseError) => void`: An optional callback function to be called when an error occurs.
 * - `logger: LogService`: An instance of the LogService class used for logging errors.
 */
export interface IErrorHandlerService {
  removeErrorFromChain(traceId: string): void;
  getDefinedBaseError(traceId: string): DefinedBaseError | null;
  getRootCause(traceId: string): Error | null;
  handleError({ error, service }: HandleErrorParams): string;
  handleUnknownDatabaseError({
    error,
    service,
    query,
    errorType,
  }: HandleUnknownDatabaseErrorParams): DatabaseError;
  handleUnknownServiceError({
    error,
    service,
    errorType,
  }: HandleUnknownServiceErrorParams): ServiceError;
  handleUnknownControllerError({
    error,
    service,
    errorType,
  }: HandleUnknownControllerErrorParams): ControllerError;
  handleUnknownServerError({
    error,
    service,
    errorType,
  }: HandleUnknownServerErrorParams): ServerError;
  handleUnknownError({ error, service }: HandleUnknownErrorParams): void;
}

interface HandleErrorParams {
  error: Error;
  service: string;
  query?: string;
  traceId?: string;
  req?: Request;
}

interface HandleUnknownDatabaseErrorParams {
  error: Error;
  service: string;
  query: string;
  errorType: new (...args: any[]) => DatabaseError;
}

interface HandleUnknownServiceErrorParams {
  error: Error;
  service: string;
  errorType: new (...args: any[]) => ServiceError;
}

interface HandleUnknownControllerErrorParams {
  error: Error;
  service: string;
  errorType: new (...args: any[]) => ControllerError;
}

interface HandleUnknownServerErrorParams {
  error: Error;
  service: string;
  errorType: new (...args: any[]) => ServerError;
}

interface HandleUnknownErrorParams {
  error: Error;
  service: string;
}

// Define the log strategy interface
class BaseLogMessage {
  private baseLogMessage: string[] = [];

  constructor(error: DefinedBaseError) {
    this.baseLogMessage.push(`${error.message}`);
    this.baseLogMessage.push(`httpStatus: ${error.httpStatus ?? "N/A"}`);
    this.baseLogMessage.push(`userMessage: ${error.userMessage ?? "N/A"}`);
    this.baseLogMessage.push(`messageCode: ${error.messageCode ?? "N/A"}`);
    this.baseLogMessage.push(`traceId: ${error.traceId}`);
    this.baseLogMessage.push(`cause: ${error.cause ?? "N/A"}`);
  }

  getBaseLogMessage(): string[] {
    return this.baseLogMessage;
  }

  getBaseLogMessageString(): string {
    return this.baseLogMessage.join("\n");
  }
}

interface LogStrategy {
  getLogMessage(error: DefinedBaseError): string;
}

// Define the log strategies
class DefaultLogStrategy implements LogStrategy {
  getLogMessage(error: DefinedBaseError): string {
    return new BaseLogMessage(error).getBaseLogMessageString();
  }
}

class DatabaseErrorLogStrategy implements LogStrategy {
  getLogMessage(error: DatabaseError): string {
    const baseLogMessage = new BaseLogMessage(error).getBaseLogMessage();
    baseLogMessage.push(`query: ${error.query ?? "N/A"}`);

    return baseLogMessage.join("\n");
  }
}

class ClientAuthErrorLogStrategy implements LogStrategy {
  getLogMessage(error: ClientAuthError): string {
    const baseLogMessage = new BaseLogMessage(error).getBaseLogMessage();
    baseLogMessage.push(`userId: ${error.userId ?? "N/A"}`);

    return baseLogMessage.join("\n");
  }
}

/**
 * Represents an error log strategy designed STRICTLY for internal test use.
 * Do not use outside of testing environments. Because this class does not have any meaning.
 *
 * @internal This class should not be used outside of testing environments.
 * @test
 */
export class TestErrorLogStrategy implements LogStrategy {
  getLogMessage(error: TestError): string {
    const baseLogMessage = new BaseLogMessage(error).getBaseLogMessage();
    baseLogMessage.push(`test: ${error.test ?? "N/A"}`);

    return baseLogMessage.join("\n");
  }
}

/**
 * The `ErrorHandlerService` class is responsible for handling and logging errors.
 * It provides methods to handle different types of errors, add them to an error chain, and retrieve the root cause of an error based on its trace ID.
 *
 * @implements {IErrorHandlerService}
 * @remark Don't create an instance of this class directly. Use the `ErrorHandlerServiceInstance` function to get the singleton instance.
 * @remark Only use this class for DI injection identifier.
 */
@injectable()
export class ErrorHandlerService {
  private onErrorCallback: (error: DefinedBaseError) => void;
  private logger: ILogService;
  private errorChains: Map<string, DefinedBaseError> = new Map();

  /**
   * Constructs an instance of ErrorHandlerService.
   */
  constructor() {
    this.onErrorCallback =
      inversifyContainer().get<(error: DefinedBaseError) => void>(
        "ErrorCallback",
      );
    this.logger = inversifyContainer().get<ILogService>(LogService);
  }

  public removeErrorFromChain(traceId: string): void {
    this.errorChains.delete(traceId);
  }

  /**
   * Logs the error using the appropriate log strategy. Different log strategies may used based on the error type.
   * @param {Error} error - The error to be logged.
   * @returns {void}
   */
  private log(error: Error): void {
    if (error instanceof DefinedBaseError) {
      const logStrategy = this.getLogStrategy(error);
      const logMessage = logStrategy.getLogMessage(error);

      this.logger.error(logMessage);
    } else {
      this.logger.error(`Unhandled error: ${error.message}`);
    }
  }

  private getLogStrategy(error: DefinedBaseError): LogStrategy {
    if (error instanceof DatabaseError) {
      return new DatabaseErrorLogStrategy();
    } else if (error instanceof ClientAuthError) {
      return new ClientAuthErrorLogStrategy();
    } else {
      return new DefaultLogStrategy();
    }
  }

  /**
   * Handles the error by adding it to the error chain and logging it.
   * @param {T} error - The error to be handled.
   * @returns {void}
   */
  private _handleError<T extends DefinedBaseError>(error: T): void {
    if (this.errorChains.has(error.traceId)) {
      error.cause = this.errorChains.get(error.traceId);
    }
    this.errorChains.set(error.traceId, error);

    this.log(error);
  }

  /**
   * Retrieves the root base error from the error chain based on the trace ID.
   * @param {string} traceId - The trace ID of the error.
   * @returns {DefinedBaseError | null} - The root base error or null if not found.
   */
  public getDefinedBaseError(traceId: string): DefinedBaseError | null {
    if (this.errorChains.has(traceId)) {
      let chain = this.errorChains.get(traceId);

      let rootBaseError = chain;
      while (chain?.cause && chain.cause instanceof DefinedBaseError) {
        rootBaseError = chain;
        chain = chain.cause;
      }

      return rootBaseError!;
    }
    return null;
  }

  /**
   * Retrieves the root cause of an error based on the provided trace ID.
   * If the root cause is not found, it returns null.
   *
   * @param traceId - The trace ID associated with the error.
   * @returns The root cause error or null if not found.
   */
  public getRootCause(traceId: string): Error | null {
    let rootBaseError: Error | null = this.getDefinedBaseError(traceId);
    while (rootBaseError instanceof DefinedBaseError && rootBaseError.cause) {
      rootBaseError = rootBaseError.cause;
    }
    return rootBaseError; // Or null if the loop didn't execute
  }

  /**
   * Handles the error and returns the trace ID.
   * @param {HandleErrorParams} params - The parameters for handling the error.
   * @returns {string} The trace ID of the error.
   */
  public handleError({ error, service }: HandleErrorParams): string {
    this.logger.setServiceName(service);

    if (error instanceof DefinedBaseError) {
      this.onErrorCallback(error);

      this._handleError(error);
      return error.traceId;
    } else {
      // Generic not defined or unhandled error
      // example: file not found, etc
      const serverError = new ServerError({
        message: `Server error: ${error.message}`,
      });
      serverError.cause = error;

      this.onErrorCallback(serverError);

      this._handleError(serverError);
      return serverError.traceId;
    }
  }

  /**
   * Handles unknown database errors.
   * @param {HandleUnknownDatabaseErrorParams} params - The parameters for handling the error.
   * @returns {DatabaseError} - The unhandled database error.
   */
  public handleUnknownDatabaseError({
    error,
    service,
    query,
    errorType,
  }: HandleUnknownDatabaseErrorParams): DatabaseError {
    const unhandledDbError = new errorType({
      query,
      cause: error as Error,
    });

    this.handleError({
      error: unhandledDbError,
      service: service,
      query: query,
    });
    return unhandledDbError;
  }

  /**
   * Handles unknown service errors.
   * @param {HandleUnknownServiceErrorParams} params - The parameters for handling the error.
   * @returns {ServiceError} - The unhandled service error.
   */
  public handleUnknownServiceError({
    error,
    service,
    errorType,
  }: HandleUnknownServiceErrorParams): ServiceError {
    const unhandledServiceError = new errorType({
      cause: error as Error,
    });
    this.handleError({
      error: unhandledServiceError,
      service: service,
    });

    return unhandledServiceError;
  }

  /**
   * Handles unknown controller errors.
   * @param {HandleUnknownControllerErrorParams} params - The parameters for handling the error.
   * @returns {ControllerError} - The unhandled controller error.
   */
  public handleUnknownControllerError({
    error,
    service,
    errorType,
  }: HandleUnknownControllerErrorParams): ControllerError {
    const unhandledControllerError = new errorType({
      cause: error as Error,
    });
    this.handleError({
      error: unhandledControllerError,
      service: service,
    });

    return unhandledControllerError;
  }

  /**
   * Handles unknown server errors.
   * @param {HandleUnknownServerErrorParams} params - The parameters for handling the error.
   * @returns {ServerError} - The unhandled server error.
   */
  public handleUnknownServerError({
    error,
    service,
    errorType,
  }: HandleUnknownServerErrorParams): ServerError {
    const unhandledServerError = new errorType({
      cause: error as Error,
    });
    this.handleError({
      error: unhandledServerError,
      service: service,
    });

    return unhandledServerError;
  }

  /**
   * Handles unknown errors.
   * @param {HandleUnknownErrorParams} params - The parameters for handling the error.
   * @returns {void}
   */
  public handleUnknownError({
    error,
    service,
  }: HandleUnknownErrorParams): void {
    this.handleError({
      error: error,
      service: service,
    });
  }
}

/**
 * Get the singleton instance of the ErrorHandlerService class.
 * @returns {IErrorHandlerService} - The instance of the ErrorHandlerService class.
 */
export const ErrorHandlerServiceInstance = (): IErrorHandlerService => {
  return inversifyContainer().get<IErrorHandlerService>(ErrorHandlerService);
};
