import "reflect-metadata";

import { Service } from "typedi";
import {
  DefinedBaseError,
  ClientAuthError,
  ControllerError,
  DatabaseError,
  ExportError,
  ServerError,
  ServiceError,
  ValidationError,
} from "../models/Errors";
import { LogService } from "./LogService";
import { Request } from "express";

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
interface LogStrategy {
  getLogMessage(error: DefinedBaseError): string;
}

// Define the log strategies
class DefaultLogStrategy implements LogStrategy {
  getLogMessage(error: DefinedBaseError): string {
    return `Unhandled error: ${error.message}`;
  }
}

class DatabaseErrorLogStrategy implements LogStrategy {
  getLogMessage(error: DatabaseError): string {
    const logMessage = [
      `${error.message} - ${error.traceId}`,
      error.stack,
      `httpStatus: ${error.httpStatus ?? "N/A"}`,
      `userMessage: ${error.userMessage ?? "N/A"}`,
      `messageCode: ${error.messageCode ?? "N/A"}`,
      `traceId: ${error.traceId}`,
      `cause: ${error.cause ?? "N/A"}`,
      `query: ${error.query ?? "N/A"}`,
    ];

    return logMessage.join("\n");
  }
}

class ClientAuthErrorLogStrategy implements LogStrategy {
  getLogMessage(error: ClientAuthError): string {
    const logMessage = [
      `${error.message} - ${error.traceId}`,
      error.stack,
      `httpStatus: ${error.httpStatus ?? "N/A"}`,
      `userMessage: ${error.userMessage ?? "N/A"}`,
      `messageCode: ${error.messageCode ?? "N/A"}`,
      `traceId: ${error.traceId}`,
      `cause: ${error.cause ?? "N/A"}`,
      `userId: ${error.userId ?? "N/A"}`,
    ];

    return logMessage.join("\n");
  }
}

// Define the error handler service
@Service()
export class ErrorHandlerService {
  private errorChains: Map<string, DefinedBaseError> = new Map();
  private logger: LogService;

  constructor() {
    this.logger = new LogService();
  }

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

  private _handleError<T extends DefinedBaseError>(error: T): void {
    if (this.errorChains.has(error.traceId)) {
      error.cause = this.errorChains.get(error.traceId);
    }
    this.errorChains.set(error.traceId, error);

    this.log(error);
  }

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

  public handleError({ error, service }: HandleErrorParams): void {
    this.logger.setServiceName(service);

    if (error instanceof DatabaseError) {
      this._handleError(error);
    } else if (error instanceof ServiceError) {
      this._handleError(error);
    } else if (error instanceof ControllerError) {
      this._handleError(error);
    } else if (error instanceof ServerError) {
      this._handleError(error);
    } else if (error instanceof ClientAuthError) {
      this._handleError(error);
    } else if (error instanceof ValidationError) {
      this._handleError(error);
    } else if (error instanceof ExportError) {
      this._handleError(error);
    } else {
      const serverError = new ServerError({
        message: `Unhandled error: ${error.message}`,
      });
      serverError.cause = error;
      this._handleError(serverError);
    }
  }

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
