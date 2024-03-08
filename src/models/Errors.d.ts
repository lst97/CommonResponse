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
declare class DefinedBaseError extends Error {
    httpStatus: number;
    userMessage: string;
    messageCode: string;
    traceId: string;
    cause?: Error;
    constructor(message: string, httpStatus: number, messageCode: string, userMessage?: string);
}
export declare class UnknownError extends Error {
    cause?: Error;
    constructor({ message, cause }: UnknownErrorParams);
}
export declare class ExportError extends DefinedBaseError {
    constructor({ message, messageCode, cause }: ExportErrorParams);
}
export declare class ExportAsExcelError extends ExportError {
    constructor({ message, cause }: ExportErrorParams);
}
export declare class ServerError extends DefinedBaseError {
    constructor({ message, messageCode, cause }: ServerErrorParams);
}
export declare class ServerInvalidEnvConfigError extends ServerError {
    constructor({ message }: ServerErrorParams);
}
export declare class ServerResourceNotFoundError extends DefinedBaseError {
    constructor(message?: string);
}
export declare class ValidationError extends DefinedBaseError {
    constructor({ message, messageCode, cause }: ValidationErrorParams);
}
export declare class ValidateRequestFormError extends ValidationError {
    constructor(message?: string);
}
export declare class ValidateRequestParamError extends ValidationError {
    constructor(message?: string);
}
export declare class ValidateRequestQueryError extends ValidationError {
    constructor(message?: string);
}
export declare class ClientAuthError extends DefinedBaseError {
    userId?: string;
    request?: Request;
    constructor({ message, messageCode, cause, request, userId, }: ClientAuthErrorParams);
}
export declare class AuthAccessDeniedError extends ClientAuthError {
    constructor({ message, request, userId }: ClientAuthErrorParams);
}
export declare class AuthInvalidEmailError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }: AuthErrorParams);
}
export declare class AuthRegistrationFailWithDuplicatedEmailError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }: AuthErrorParams);
}
export declare class AuthInvalidPasswordError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }: AuthErrorParams);
}
export declare class AuthInvalidCredentialsError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }: AuthErrorParams);
}
export declare class AuthAccessTokenExpiredError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }: AuthErrorParams);
}
export declare class AuthAccessTokenInvalidError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }: AuthErrorParams);
}
export declare class AuthAccessTokenMissingError extends ClientAuthError {
    constructor({ message, messageCode, cause, request }: AuthErrorParams);
}
export declare class ServiceError extends DefinedBaseError {
    constructor({ message, messageCode, cause }: ServiceErrorParams);
}
export declare class ControllerError extends DefinedBaseError {
    constructor(message?: string);
}
export declare class DatabaseError extends DefinedBaseError {
    query?: string;
    constructor({ message, messageCode, cause, query }: DatabaseErrorParams);
}
export declare class PartialError extends DefinedBaseError {
    constructor({ message, messageCode, cause }: PartialErrorParams);
}
export declare class SqlCreateError extends DatabaseError {
    constructor({ message, query, cause }: SqlErrorParams);
}
export declare class SqlReadError extends DatabaseError {
    query?: string;
    constructor({ message, query, cause }: SqlErrorParams);
}
export declare class SqlUpdateError extends DatabaseError {
    query?: string;
    constructor({ message, query, cause }: SqlErrorParams);
}
export declare class SqlDeleteError extends DatabaseError {
    query?: string;
    constructor({ message, query, cause }: SqlErrorParams);
}
export declare class SqlRecordNotFoundError extends DatabaseError {
    query?: string;
    constructor({ message, query, cause }: SqlErrorParams);
}
export declare class SqlOperationFailError extends DatabaseError {
    query?: string;
    constructor({ message, query, cause }: SqlErrorParams);
}
export declare class SqlRecordExistsError extends DatabaseError {
    query?: string;
    constructor({ message, query, cause }: SqlErrorParams);
}
export default DefinedBaseError;
