"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessage = exports.ResponseWarning = void 0;
class ResponseWarning {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
exports.ResponseWarning = ResponseWarning;
class ResponseMessage {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
exports.ResponseMessage = ResponseMessage;
// For partial success
class Result {
    constructor(data, success, errorMessage) {
        this.data = data;
        this.success = success;
        this.errorMessage = errorMessage;
    }
}
class BackendStandardResponse {
    constructor(input) {
        this.status = input.status;
        this.message = input.message;
        this.data = input.data;
        this.requestId = input.requestId;
        this.traceId = input.traceId;
        this.timestamp = input.timestamp || new Date().toISOString();
        this.warnings = input.warnings;
        this.version = input.version || '1.0';
        this.pagination = input.pagination;
        this.metadata = input.metadata;
        this.result = input.result;
    }
}
exports.default = BackendStandardResponse;
