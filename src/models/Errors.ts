import { v4 as uuidv4 } from "uuid";
import {
  IMessageCodeService,
  MessageCodeService,
} from "../services/MessageCodeService";
import { injectable } from "inversify";
import { inversifyContainer } from "../inversify.config";
import { Config } from "../CommonResponse.config";

interface TestErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
  test: string;
}
interface SqlErrorParams {
  message?: string;
  query?: string;
  cause?: Error;
}

interface ClientAuthErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
  request?: any;
  userId?: string;
}

interface ExportErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
}

interface ValidationErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
  request?: any;
}

interface PartialErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
}

interface AuthErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
  request?: any;
}

interface DatabaseErrorParams {
  query?: string;
  messageCode?: string;
  message?: string;
  cause?: Error;
}

interface ServiceErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
}

interface ServerErrorParams {
  message?: string;
  messageCode?: string;
  cause?: Error;
}

interface UnknownErrorParams {
  message?: string;
  cause?: Error;
}

@injectable()
export class DefinedBaseError extends Error {
  httpStatus: number;
  userMessage: string;
  messageCode: string;
  traceId: string;
  cause?: Error;

  constructor(
    message: string,
    httpStatus: number,
    messageCode: string,
    userMessage?: string,
  ) {
    super(message);
    this.httpStatus = httpStatus;
    this.userMessage = userMessage || message;
    this.messageCode = messageCode;
    this.traceId = `${Config.instance.idIdentifier}.${
      Config.instance.traceIdName
    }.${uuidv4()}`;
  }
}

/**
 * Represents an error designed STRICTLY for internal test use.
 * Do not use outside of testing environments. Because this class does not have any meaning.
 *
 * @internal This class should not be used outside of testing environments.
 * @test
 */
export class TestError extends DefinedBaseError {
  test: string;
  constructor({ message, messageCode, cause, test }: TestErrorParams) {
    super(message || `Test error: ${test}`, 500, messageCode || "TEST");

    this.test = test;

    if (this.cause === undefined) {
      this.cause = cause;
    }
  }
}

export class UnknownError extends Error {
  cause?: Error;
  constructor({ message, cause }: UnknownErrorParams) {
    super(message);
    this.cause = cause;
  }
}

export class ExportError extends DefinedBaseError {
  constructor({ message, messageCode, cause }: ExportErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Export.ExportFail;

    const responseMessage = messageCode
      ? inversifyContainer()
          .get<IMessageCodeService>(MessageCodeService)
          .getResponseMessageByCode(messageCode)
      : null;

    super(
      message || responseMessage?.Message || defaultMessage.Message,
      responseMessage?.StatusCode || defaultMessage.StatusCode,
      messageCode || defaultMessage.Code,
    );

    if (this.cause === undefined) {
      this.cause = cause;
    }
  }
}

export class ExportAsExcelError extends ExportError {
  constructor({ message, cause }: ExportErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Export.ExportAsExcelFail;

    super({
      message: message || defaultMessage.Message,
      messageCode: defaultMessage.Code,
      cause: cause,
    });
  }
}
export class ServerError extends DefinedBaseError {
  constructor({ message, messageCode, cause }: ServerErrorParams) {
    const messageCodeService =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService);
    const defaultFailedOperation =
      messageCodeService.Messages.Common.OperationFail;

    const responseMessage = messageCode
      ? messageCodeService.getResponseMessageByCode(messageCode)
      : null;

    super(
      message ?? responseMessage?.Message ?? defaultFailedOperation.Message,
      responseMessage?.StatusCode ?? defaultFailedOperation.StatusCode,
      messageCode ?? defaultFailedOperation.Code,
    );

    if (this.cause === undefined) {
      this.cause = cause;
    }
  }
}

export class ServerInvalidEnvConfigError extends ServerError {
  constructor({ message }: ServerErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Server.InvalidEnvConfig;

    super({
      message: message || defaultMessage.Message,
      messageCode: defaultMessage.Code,
    });
  }
}

export class ServerResourceNotFoundError extends DefinedBaseError {
  constructor(message?: string) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Common.ResourceNotFound;

    super(
      message || defaultMessage.Message,
      defaultMessage.StatusCode,
      defaultMessage.Code,
    );
  }
}

export class ValidationError extends DefinedBaseError {
  constructor({ message, messageCode, cause }: ValidationErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Validation.InvalidRequest;

    const responseMessage = messageCode
      ? inversifyContainer()
          .get<IMessageCodeService>(MessageCodeService)
          .getResponseMessageByCode(messageCode)
      : null;

    super(
      message ?? responseMessage?.Message ?? defaultMessage.Message,
      responseMessage?.StatusCode ?? defaultMessage.StatusCode,
      messageCode ?? defaultMessage.Code,
    );

    if (this.cause === undefined) {
      this.cause = cause;
    }
  }
}

export class ValidateRequestFormError extends ValidationError {
  constructor(message?: string) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Validation.InvalidRequestForm;

    super({
      message: message || defaultMessage.Message,
      messageCode: defaultMessage.Code,
    });
  }
}

export class ValidateRequestParamError extends ValidationError {
  constructor(message?: string) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Validation.InvalidRequestParameter;

    super({
      message: message || defaultMessage.Message,
      messageCode: defaultMessage.Code,
    });
  }
}

export class ValidateRequestQueryError extends ValidationError {
  constructor(message?: string) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Validation.InvalidRequestQuery;

    super({
      message: message || defaultMessage.Message,
      messageCode: defaultMessage.Code,
    });
  }
}

export class ClientAuthError extends DefinedBaseError {
  userId?: string;
  request?: Request;

  constructor({
    message,
    messageCode,
    cause,
    request,
    userId,
  }: ClientAuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.AuthFail;

    const responseMessage = messageCode
      ? inversifyContainer()
          .get<IMessageCodeService>(MessageCodeService)
          .getResponseMessageByCode(messageCode)
      : null;

    super(
      message ?? responseMessage?.Message ?? defaultMessage.Message,
      responseMessage?.StatusCode ?? defaultMessage.StatusCode,
      messageCode ?? defaultMessage.Code,
    );

    if (cause === undefined) {
      this.cause = cause;
    }

    this.request = request;
    this.userId = userId;
  }
}

export class AuthAccessDeniedError extends ClientAuthError {
  constructor({ message, request, userId }: ClientAuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Common.AccessDenied;

    super({
      message: message || defaultMessage.Message,
      messageCode: defaultMessage.Code,
      request,
      userId,
    });
  }
}

export class AuthInvalidEmailError extends ClientAuthError {
  constructor({ message, messageCode, cause, request }: AuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.InvalidEmail;

    super({
      message: message || defaultMessage.Message,
      messageCode: messageCode || defaultMessage.Code,
      cause: cause,
      request: request,
      userId: request?.user?.id,
    });
  }
}

export class AuthRegistrationFailWithDuplicatedEmailError extends ClientAuthError {
  constructor({ message, messageCode, cause, request }: AuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.RegistrationFailWithDuplicatedEmail;

    super({
      message: message || defaultMessage.Message,
      messageCode: messageCode || defaultMessage.Code,
      cause: cause,
      request: request,
      userId: request?.user?.id,
    });
  }
}
export class AuthInvalidPasswordError extends ClientAuthError {
  constructor({ message, messageCode, cause, request }: AuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.InvalidPassword;

    super({
      message: message || defaultMessage.Message,
      messageCode: messageCode || defaultMessage.Code,
      cause: cause,
      request: request,
      userId: request?.user?.id,
    });
  }
}

export class AuthInvalidCredentialsError extends ClientAuthError {
  constructor({ message, messageCode, cause, request }: AuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.InvalidCredentials;

    super({
      message: message || defaultMessage.Message,
      messageCode: messageCode || defaultMessage.Code,
      cause: cause,
      request: request,
      userId: request?.user?.id,
    });
  }
}

export class AuthAccessTokenExpiredError extends ClientAuthError {
  constructor({ message, messageCode, cause, request }: AuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.AccessTokenExpired;

    super({
      message: message || defaultMessage.Message,
      messageCode: messageCode || defaultMessage.Code,
      cause: cause,
      request: request,
      userId: request?.user?.id,
    });
  }
}

export class AuthAccessTokenInvalidError extends ClientAuthError {
  constructor({ message, messageCode, cause, request }: AuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.AccessTokenInvalid;

    super({
      message: message || defaultMessage.Message,
      messageCode: messageCode || defaultMessage.Code,
      cause: cause,
      request: request,
      userId: request?.user?.id,
    });
  }
}

export class AuthAccessTokenMissingError extends ClientAuthError {
  constructor({ message, messageCode, cause, request }: AuthErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Auth.AccessTokenMissing;

    super({
      message: message || defaultMessage.Message,
      messageCode: messageCode || defaultMessage.Code,
      cause: cause,
      request: request,
      userId: request?.user?.id,
    });
  }
}
//////////// Layer specific errors
export class ServiceError extends DefinedBaseError {
  // Generic service error
  constructor({ message, messageCode, cause }: ServiceErrorParams) {
    const messageCodeService =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService);
    const defaultFailedOperation =
      messageCodeService.Messages.Common.OperationFail;

    const responseMessage = messageCode
      ? messageCodeService.getResponseMessageByCode(messageCode)
      : null;

    super(
      message ?? responseMessage?.Message ?? defaultFailedOperation.Message,
      responseMessage?.StatusCode ?? defaultFailedOperation.StatusCode,
      messageCode ?? defaultFailedOperation.Code,
    );

    if (this.cause === undefined) {
      this.cause = cause;
    }
  }
}

export class ControllerError extends DefinedBaseError {
  // Generic controller error
  constructor(message?: string) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Common.OperationFail;

    super(
      message || defaultMessage.Message,
      defaultMessage.StatusCode,
      defaultMessage.Code,
    );
  }
}

export class DatabaseError extends DefinedBaseError {
  // Generic database error
  query?: string;

  constructor({ message, messageCode, cause, query }: DatabaseErrorParams) {
    const messageCodeService =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService);
    const defaultFailedOperation =
      messageCodeService.Messages.Sql.OperationFail;

    const responseMessage = messageCode
      ? messageCodeService.getResponseMessageByCode(messageCode)
      : null;

    super(
      message ?? responseMessage?.Message ?? defaultFailedOperation.Message,
      responseMessage?.StatusCode ?? defaultFailedOperation.StatusCode,
      messageCode ?? defaultFailedOperation.Code,
    );

    this.query = query;
    if (this.cause === undefined && cause) {
      this.cause = cause;
    }
  }
}

export class PartialError extends DefinedBaseError {
  // Partial error
  constructor({ message, messageCode, cause }: PartialErrorParams) {
    const messageCodeService =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService);
    const defaultFailedOperation =
      messageCodeService.Messages.Common.PartialOperationFail;

    const responseMessage = messageCode
      ? messageCodeService.getResponseMessageByCode(messageCode)
      : null;

    super(
      message ?? responseMessage?.Message ?? defaultFailedOperation.Message,
      responseMessage?.StatusCode ?? defaultFailedOperation.StatusCode,
      messageCode ?? defaultFailedOperation.Code,
    );

    if (this.cause === undefined) {
      this.cause = cause;
    }
  }
}

//////////// Leaf errors (database)
export class SqlCreateError extends DatabaseError {
  constructor({ message, query, cause }: SqlErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Sql.CreateFail;

    super({ message: message || defaultMessage.Message, cause });

    this.query = query;
  }
}

export class SqlReadError extends DatabaseError {
  query?: string;

  constructor({ message, query, cause }: SqlErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Sql.OperationFail;

    super({ message: message || defaultMessage.Message, cause });

    this.query = query;
  }
}

export class SqlUpdateError extends DatabaseError {
  query?: string;

  constructor({ message, query, cause }: SqlErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Sql.UpdateFail;

    super({ message: message || defaultMessage.Message, cause });

    this.query = query;
  }
}

export class SqlDeleteError extends DatabaseError {
  query?: string;

  constructor({ message, query, cause }: SqlErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Sql.DeleteFail;

    super({ message: message || defaultMessage.Message, cause });

    this.query = query;
  }
}

export class SqlRecordNotFoundError extends DatabaseError {
  query?: string;

  constructor({ message, query, cause }: SqlErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Sql.RecordNotFound;

    super({ message: message || defaultMessage.Message, cause });

    this.query = query;
  }
}

export class SqlOperationFailError extends DatabaseError {
  query?: string;

  constructor({ message, query, cause }: SqlErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Sql.OperationFail;

    super({ message: message || defaultMessage.Message, cause });

    this.query = query;
  }
}

export class SqlRecordExistsError extends DatabaseError {
  query?: string;

  constructor({ message, query, cause }: SqlErrorParams) {
    const defaultMessage =
      inversifyContainer().get<IMessageCodeService>(MessageCodeService).Messages
        .Sql.RecordExists;

    super({
      message: message || defaultMessage.Message,
      messageCode: defaultMessage.Code,
      cause,
    });

    this.query = query;
  }
}
