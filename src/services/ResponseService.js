"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const Response_1 = __importStar(require("../models/Response"));
const Errors_1 = __importStar(require("../models/Errors"));
let ResponseService = (() => {
    let _classDecorators = [(0, typedi_1.Service)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ResponseService = _classThis = class {
        constructor(errorHandlerService, messageCodeService) {
            this.errorHandlerService = errorHandlerService;
            this.messageCodeService = messageCodeService;
        }
        /**
         * Sends an error response to the client.
         * @param res - The Express response object.
         * @param error - The error object that occurred.
         * @param requestId - A unique identifier for the request.
         * @param httpStatus - The HTTP status code for the response. Defaults to 500 if not provided.
         * @returns The Express response object with the error response sent to the client.
         */
        sendError(res, error, requestId, httpStatus = 500) {
            let message = null;
            let traceId = "";
            if (!(error instanceof Errors_1.default)) {
                this.errorHandlerService.handleUnknownError({
                    error: error,
                    service: ResponseService.name,
                });
            }
            else {
                const rootCause = this.errorHandlerService.getDefinedBaseError(error.traceId);
                message = new Response_1.ResponseMessage(rootCause.messageCode, rootCause.userMessage);
                traceId = rootCause.traceId;
                httpStatus = error.httpStatus;
            }
            if (error instanceof Errors_1.ServerError ||
                (error instanceof Errors_1.DatabaseError &&
                    !(error instanceof Errors_1.SqlRecordNotFoundError ||
                        error instanceof Errors_1.SqlRecordExistsError)) ||
                !message) {
                message = new Response_1.ResponseMessage(this.messageCodeService.Messages.Common.OperationFail.Code, this.messageCodeService.Messages.Common.OperationFail.Message);
            }
            const response = new Response_1.default({
                status: "error",
                message: message,
                requestId,
                traceId,
            });
            return res.status(httpStatus).json(response);
        }
        /**
         * Sends a successful response to the client with the provided data.
         * @param res - The Express response object.
         * @param data - The data to be sent in the response.
         * @param requestId - A unique identifier for the request.
         * @param status - The HTTP status code for the response. (default: 200)
         * @returns The Express response object with the successful response sent to the client.
         */
        sendSuccess(res, data, requestId, status = 200) {
            const response = new Response_1.default({
                status: "success",
                message: new Response_1.ResponseMessage(this.messageCodeService.Messages.Common.OperationSuccess.Code, this.messageCodeService.Messages.Common.OperationSuccess.Message),
                data,
                requestId,
            });
            return res.status(status).json(response);
        }
    };
    __setFunctionName(_classThis, "ResponseService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResponseService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResponseService = _classThis;
})();
exports.default = ResponseService;
