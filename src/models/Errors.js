"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlRecordExistsError = exports.SqlOperationFailError = exports.SqlRecordNotFoundError = exports.SqlDeleteError = exports.SqlUpdateError = exports.SqlReadError = exports.SqlCreateError = exports.PartialError = exports.DatabaseError = exports.ControllerError = exports.ServiceError = exports.AuthAccessTokenMissingError = exports.AuthAccessTokenInvalidError = exports.AuthAccessTokenExpiredError = exports.AuthInvalidCredentialsError = exports.AuthInvalidPasswordError = exports.AuthRegistrationFailWithDuplicatedEmailError = exports.AuthInvalidEmailError = exports.AuthAccessDeniedError = exports.ClientAuthError = exports.ValidateRequestQueryError = exports.ValidateRequestParamError = exports.ValidateRequestFormError = exports.ValidationError = exports.ServerResourceNotFoundError = exports.ServerInvalidEnvConfigError = exports.ServerError = exports.ExportAsExcelError = exports.ExportError = exports.UnknownError = void 0;
const typedi_1 = __importDefault(require("typedi"));
const MessageCodeService_1 = require("../services/MessageCodeService");
const uuid_1 = require("uuid");
class DefinedBaseError extends Error {
    constructor(message, httpStatus, messageCode, userMessage) {
        super(message);
        this.httpStatus = httpStatus;
        this.userMessage = userMessage || message;
        this.messageCode = messageCode;
        this.traceId = `stzita.traceId.${(0, uuid_1.v4)()}`;
    }
}
class UnknownError extends Error {
    constructor({ message, cause }) {
        super(message);
        this.cause = cause;
    }
}
exports.UnknownError = UnknownError;
class ExportError extends DefinedBaseError {
    constructor({ message, messageCode, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Export.ExportFail;
        const responseMessage = messageCode
            ? typedi_1.default.get(MessageCodeService_1.MessageCodeService).getResponseMessageByCode(messageCode)
            : null;
        super(message || (responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.Message) || defaultMessage.Message, (responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.StatusCode) || defaultMessage.StatusCode, messageCode || defaultMessage.Code);
        if (this.cause === undefined) {
            this.cause = cause;
        }
    }
}
exports.ExportError = ExportError;
class ExportAsExcelError extends ExportError {
    constructor({ message, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Export.ExportAsExcelFail;
        super({
            message: message || defaultMessage.Message,
            messageCode: defaultMessage.Code,
            cause: cause,
        });
    }
}
exports.ExportAsExcelError = ExportAsExcelError;
class ServerError extends DefinedBaseError {
    constructor({ message, messageCode, cause }) {
        var _a, _b;
        const messageCodeService = typedi_1.default.get(MessageCodeService_1.MessageCodeService);
        const defaultFailedOperation = messageCodeService.Messages.Common.OperationFail;
        const responseMessage = messageCode
            ? messageCodeService.getResponseMessageByCode(messageCode)
            : null;
        super((_a = message !== null && message !== void 0 ? message : responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.Message) !== null && _a !== void 0 ? _a : defaultFailedOperation.Message, (_b = responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.StatusCode) !== null && _b !== void 0 ? _b : defaultFailedOperation.StatusCode, messageCode !== null && messageCode !== void 0 ? messageCode : defaultFailedOperation.Code);
        if (this.cause === undefined) {
            this.cause = cause;
        }
    }
}
exports.ServerError = ServerError;
class ServerInvalidEnvConfigError extends ServerError {
    constructor({ message }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Server.InvalidEnvConfig;
        super({
            message: message || defaultMessage.Message,
            messageCode: defaultMessage.Code,
        });
    }
}
exports.ServerInvalidEnvConfigError = ServerInvalidEnvConfigError;
class ServerResourceNotFoundError extends DefinedBaseError {
    constructor(message) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Common.ResourceNotFound;
        super(message || defaultMessage.Message, defaultMessage.StatusCode, defaultMessage.Code);
    }
}
exports.ServerResourceNotFoundError = ServerResourceNotFoundError;
class ValidationError extends DefinedBaseError {
    constructor({ message, messageCode, cause }) {
        var _a, _b;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Validation.InvalidRequest;
        const responseMessage = messageCode
            ? typedi_1.default.get(MessageCodeService_1.MessageCodeService).getResponseMessageByCode(messageCode)
            : null;
        super((_a = message !== null && message !== void 0 ? message : responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.Message) !== null && _a !== void 0 ? _a : defaultMessage.Message, (_b = responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.StatusCode) !== null && _b !== void 0 ? _b : defaultMessage.StatusCode, messageCode !== null && messageCode !== void 0 ? messageCode : defaultMessage.Code);
        if (this.cause === undefined) {
            this.cause = cause;
        }
    }
}
exports.ValidationError = ValidationError;
class ValidateRequestFormError extends ValidationError {
    constructor(message) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Validation.InvalidRequestForm;
        super({
            message: message || defaultMessage.Message,
            messageCode: defaultMessage.Code,
        });
    }
}
exports.ValidateRequestFormError = ValidateRequestFormError;
class ValidateRequestParamError extends ValidationError {
    constructor(message) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Validation
            .InvalidRequestParameter;
        super({
            message: message || defaultMessage.Message,
            messageCode: defaultMessage.Code,
        });
    }
}
exports.ValidateRequestParamError = ValidateRequestParamError;
class ValidateRequestQueryError extends ValidationError {
    constructor(message) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Validation.InvalidRequestQuery;
        super({
            message: message || defaultMessage.Message,
            messageCode: defaultMessage.Code,
        });
    }
}
exports.ValidateRequestQueryError = ValidateRequestQueryError;
class ClientAuthError extends DefinedBaseError {
    constructor({ message, messageCode, cause, request, userId, }) {
        var _a, _b;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth.AuthFail;
        const responseMessage = messageCode
            ? typedi_1.default.get(MessageCodeService_1.MessageCodeService).getResponseMessageByCode(messageCode)
            : null;
        super((_a = message !== null && message !== void 0 ? message : responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.Message) !== null && _a !== void 0 ? _a : defaultMessage.Message, (_b = responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.StatusCode) !== null && _b !== void 0 ? _b : defaultMessage.StatusCode, messageCode !== null && messageCode !== void 0 ? messageCode : defaultMessage.Code);
        if (cause === undefined) {
            this.cause = cause;
        }
        this.request = request;
        this.userId = userId;
    }
}
exports.ClientAuthError = ClientAuthError;
class AuthAccessDeniedError extends ClientAuthError {
    constructor({ message, request, userId }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Common.AccessDenied;
        super({
            message: message || defaultMessage.Message,
            messageCode: defaultMessage.Code,
            request,
            userId,
        });
    }
}
exports.AuthAccessDeniedError = AuthAccessDeniedError;
class AuthInvalidEmailError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }) {
        var _a;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth.InvalidEmail;
        super({
            message: message || defaultMessage.Message,
            messageCode: messageCode || defaultMessage.Code,
            cause: cause,
            request: request,
            userId: (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
}
exports.AuthInvalidEmailError = AuthInvalidEmailError;
class AuthRegistrationFailWithDuplicatedEmailError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }) {
        var _a;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth
            .RegistrationFailWithDuplicatedEmail;
        super({
            message: message || defaultMessage.Message,
            messageCode: messageCode || defaultMessage.Code,
            cause: cause,
            request: request,
            userId: (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
}
exports.AuthRegistrationFailWithDuplicatedEmailError = AuthRegistrationFailWithDuplicatedEmailError;
class AuthInvalidPasswordError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }) {
        var _a;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth.InvalidPassword;
        super({
            message: message || defaultMessage.Message,
            messageCode: messageCode || defaultMessage.Code,
            cause: cause,
            request: request,
            userId: (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
}
exports.AuthInvalidPasswordError = AuthInvalidPasswordError;
class AuthInvalidCredentialsError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }) {
        var _a;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth.InvalidCredentials;
        super({
            message: message || defaultMessage.Message,
            messageCode: messageCode || defaultMessage.Code,
            cause: cause,
            request: request,
            userId: (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
}
exports.AuthInvalidCredentialsError = AuthInvalidCredentialsError;
class AuthAccessTokenExpiredError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }) {
        var _a;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth.AccessTokenExpired;
        super({
            message: message || defaultMessage.Message,
            messageCode: messageCode || defaultMessage.Code,
            cause: cause,
            request: request,
            userId: (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
}
exports.AuthAccessTokenExpiredError = AuthAccessTokenExpiredError;
class AuthAccessTokenInvalidError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }) {
        var _a;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth.AccessTokenInvalid;
        super({
            message: message || defaultMessage.Message,
            messageCode: messageCode || defaultMessage.Code,
            cause: cause,
            request: request,
            userId: (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
}
exports.AuthAccessTokenInvalidError = AuthAccessTokenInvalidError;
class AuthAccessTokenMissingError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }) {
        var _a;
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Auth.AccessTokenMissing;
        super({
            message: message || defaultMessage.Message,
            messageCode: messageCode || defaultMessage.Code,
            cause: cause,
            request: request,
            userId: (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
}
exports.AuthAccessTokenMissingError = AuthAccessTokenMissingError;
//////////// Layer specific errors
class ServiceError extends DefinedBaseError {
    // Generic service error
    constructor({ message, messageCode, cause }) {
        var _a, _b;
        const messageCodeService = typedi_1.default.get(MessageCodeService_1.MessageCodeService);
        const defaultFailedOperation = messageCodeService.Messages.Common.OperationFail;
        const responseMessage = messageCode
            ? messageCodeService.getResponseMessageByCode(messageCode)
            : null;
        super((_a = message !== null && message !== void 0 ? message : responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.Message) !== null && _a !== void 0 ? _a : defaultFailedOperation.Message, (_b = responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.StatusCode) !== null && _b !== void 0 ? _b : defaultFailedOperation.StatusCode, messageCode !== null && messageCode !== void 0 ? messageCode : defaultFailedOperation.Code);
        if (this.cause === undefined) {
            this.cause = cause;
        }
    }
}
exports.ServiceError = ServiceError;
class ControllerError extends DefinedBaseError {
    // Generic controller error
    constructor(message) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Common.OperationFail;
        super(message || defaultMessage.Message, defaultMessage.StatusCode, defaultMessage.Code);
    }
}
exports.ControllerError = ControllerError;
class DatabaseError extends DefinedBaseError {
    constructor({ message, messageCode, cause, query }) {
        var _a, _b;
        const messageCodeService = typedi_1.default.get(MessageCodeService_1.MessageCodeService);
        const defaultFailedOperation = messageCodeService.Messages.Sql.OperationFail;
        const responseMessage = messageCode
            ? messageCodeService.getResponseMessageByCode(messageCode)
            : null;
        super((_a = message !== null && message !== void 0 ? message : responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.Message) !== null && _a !== void 0 ? _a : defaultFailedOperation.Message, (_b = responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.StatusCode) !== null && _b !== void 0 ? _b : defaultFailedOperation.StatusCode, messageCode !== null && messageCode !== void 0 ? messageCode : defaultFailedOperation.Code);
        this.query = query;
        if (this.cause === undefined && cause) {
            this.cause = cause;
        }
    }
}
exports.DatabaseError = DatabaseError;
class PartialError extends DefinedBaseError {
    // Partial error
    constructor({ message, messageCode, cause }) {
        var _a, _b;
        const messageCodeService = typedi_1.default.get(MessageCodeService_1.MessageCodeService);
        const defaultFailedOperation = messageCodeService.Messages.Common.PartialOperationFail;
        const responseMessage = messageCode
            ? messageCodeService.getResponseMessageByCode(messageCode)
            : null;
        super((_a = message !== null && message !== void 0 ? message : responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.Message) !== null && _a !== void 0 ? _a : defaultFailedOperation.Message, (_b = responseMessage === null || responseMessage === void 0 ? void 0 : responseMessage.StatusCode) !== null && _b !== void 0 ? _b : defaultFailedOperation.StatusCode, messageCode !== null && messageCode !== void 0 ? messageCode : defaultFailedOperation.Code);
        if (this.cause === undefined) {
            this.cause = cause;
        }
    }
}
exports.PartialError = PartialError;
//////////// Leaf errors (database)
class SqlCreateError extends DatabaseError {
    constructor({ message, query, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Sql.CreateFail;
        super({ message: message || defaultMessage.Message, cause });
        this.query = query;
    }
}
exports.SqlCreateError = SqlCreateError;
class SqlReadError extends DatabaseError {
    constructor({ message, query, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Sql.OperationFail;
        super({ message: message || defaultMessage.Message, cause });
        this.query = query;
    }
}
exports.SqlReadError = SqlReadError;
class SqlUpdateError extends DatabaseError {
    constructor({ message, query, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Sql.UpdateFail;
        super({ message: message || defaultMessage.Message, cause });
        this.query = query;
    }
}
exports.SqlUpdateError = SqlUpdateError;
class SqlDeleteError extends DatabaseError {
    constructor({ message, query, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Sql.DeleteFail;
        super({ message: message || defaultMessage.Message, cause });
        this.query = query;
    }
}
exports.SqlDeleteError = SqlDeleteError;
class SqlRecordNotFoundError extends DatabaseError {
    constructor({ message, query, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Sql.RecordNotFound;
        super({ message: message || defaultMessage.Message, cause });
        this.query = query;
    }
}
exports.SqlRecordNotFoundError = SqlRecordNotFoundError;
class SqlOperationFailError extends DatabaseError {
    constructor({ message, query, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Sql.OperationFail;
        super({ message: message || defaultMessage.Message, cause });
        this.query = query;
    }
}
exports.SqlOperationFailError = SqlOperationFailError;
class SqlRecordExistsError extends DatabaseError {
    constructor({ message, query, cause }) {
        const defaultMessage = typedi_1.default.get(MessageCodeService_1.MessageCodeService).Messages.Sql.RecordExists;
        super({
            message: message || defaultMessage.Message,
            messageCode: defaultMessage.Code,
            cause,
        });
        this.query = query;
    }
}
exports.SqlRecordExistsError = SqlRecordExistsError;
exports.default = DefinedBaseError;
