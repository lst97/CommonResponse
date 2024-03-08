interface Message {
    code: string;
    message: string;
}
export declare class ResponseWarning implements Message {
    code: string;
    message: string;
    constructor(code: string, message: string);
}
export declare class ResponseMessage implements Message {
    code: string;
    message: string;
    constructor(code: string, message: string);
}
export interface Pagination {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
}
export interface Metadata {
}
declare class Result<T> {
    data: T;
    success: boolean;
    errorMessage?: string;
    constructor(data: T, success: boolean, errorMessage?: string);
}
interface BackendStandardResponseInput<T> {
    status: 'success' | 'error' | 'partial';
    message: ResponseMessage;
    data?: T;
    requestId: string;
    traceId?: string;
    timestamp?: string;
    warnings?: ResponseWarning[];
    version?: string;
    pagination?: Pagination;
    metadata?: Metadata;
    result?: Result<T>[];
}
declare class BackendStandardResponse<T> {
    status: 'success' | 'error' | 'partial';
    message: ResponseMessage;
    data?: T;
    requestId: string;
    traceId?: string;
    timestamp?: string;
    warnings?: ResponseWarning[];
    version?: string;
    pagination?: Pagination;
    metadata?: Metadata;
    result?: Result<T>[];
    constructor(input: BackendStandardResponseInput<T>);
}
export default BackendStandardResponse;
