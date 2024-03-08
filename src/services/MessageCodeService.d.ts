interface ResponseMessages {
    [key: string]: {
        [key: string]: ResponseMessage;
    };
}
export declare class ResponseMessage {
    Code: string;
    Message: string;
    StatusCode: number;
    constructor(code: string, message: string, statusCode: number);
}
export declare class MessageCodeService {
    readonly Messages: ResponseMessages;
    constructor();
    getResponseMessageByCode(code: string): ResponseMessage | undefined;
}
export {};
