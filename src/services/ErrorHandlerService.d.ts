import DefinedBaseError, { ControllerError, DatabaseError, ServerError, ServiceError } from '../models/Errors';
import LogService from './LogService';
import { Request } from 'express';
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
declare class ErrorHandlerService {
    private logger;
    private errorChains;
    constructor(logger: LogService);
    private log;
    private getLogStrategy;
    private _handleError;
    getDefinedBaseError(traceId: string): DefinedBaseError | null;
    handleError({ error, service, req }: HandleErrorParams): void;
    handleUnknownDatabaseError({ error, service, query, errorType }: HandleUnknownDatabaseErrorParams): DatabaseError;
    handleUnknownServiceError({ error, service, errorType }: HandleUnknownServiceErrorParams): ServiceError;
    handleUnknownControllerError({ error, service, errorType }: HandleUnknownControllerErrorParams): ControllerError;
    handleUnknownServerError({ error, service, errorType }: HandleUnknownServerErrorParams): ServerError;
    handleUnknownError({ error, service }: HandleUnknownErrorParams): void;
}
export default ErrorHandlerService;
