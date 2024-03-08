import { Response } from "express";
import ErrorHandlerService from "../services/ErrorHandlerService";
import { MessageCodeService } from "./MessageCodeService";
declare class ResponseService {
    private errorHandlerService;
    private messageCodeService;
    constructor(errorHandlerService: ErrorHandlerService, messageCodeService: MessageCodeService);
    /**
     * Sends an error response to the client.
     * @param res - The Express response object.
     * @param error - The error object that occurred.
     * @param requestId - A unique identifier for the request.
     * @param httpStatus - The HTTP status code for the response. Defaults to 500 if not provided.
     * @returns The Express response object with the error response sent to the client.
     */
    sendError(res: Response, error: Error, requestId: string, httpStatus?: number): Response<any, Record<string, any>>;
    /**
     * Sends a successful response to the client with the provided data.
     * @param res - The Express response object.
     * @param data - The data to be sent in the response.
     * @param requestId - A unique identifier for the request.
     * @param status - The HTTP status code for the response. (default: 200)
     * @returns The Express response object with the successful response sent to the client.
     */
    sendSuccess(res: Response, data: any, requestId: string, status?: number): Response<any, Record<string, any>>;
}
export default ResponseService;
