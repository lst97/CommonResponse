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
const Errors_1 = __importStar(require("../models/Errors"));
// Define the log strategies
class DefaultLogStrategy {
    getLogMessage(error) {
        return `Unhandled error: ${error.message}`;
    }
}
class DatabaseErrorLogStrategy {
    getLogMessage(error) {
        var _a, _b, _c, _d, _e;
        const logMessage = [
            `${error.message} - ${error.traceId}`,
            error.stack,
            `httpStatus: ${(_a = error.httpStatus) !== null && _a !== void 0 ? _a : 'N/A'}`,
            `userMessage: ${(_b = error.userMessage) !== null && _b !== void 0 ? _b : 'N/A'}`,
            `messageCode: ${(_c = error.messageCode) !== null && _c !== void 0 ? _c : 'N/A'}`,
            `traceId: ${error.traceId}`,
            `cause: ${(_d = error.cause) !== null && _d !== void 0 ? _d : 'N/A'}`,
            `query: ${(_e = error.query) !== null && _e !== void 0 ? _e : 'N/A'}`
        ];
        return logMessage.join('\n');
    }
}
class ClientAuthErrorLogStrategy {
    getLogMessage(error) {
        var _a, _b, _c, _d, _e;
        const logMessage = [
            `${error.message} - ${error.traceId}`,
            error.stack,
            `httpStatus: ${(_a = error.httpStatus) !== null && _a !== void 0 ? _a : 'N/A'}`,
            `userMessage: ${(_b = error.userMessage) !== null && _b !== void 0 ? _b : 'N/A'}`,
            `messageCode: ${(_c = error.messageCode) !== null && _c !== void 0 ? _c : 'N/A'}`,
            `traceId: ${error.traceId}`,
            `cause: ${(_d = error.cause) !== null && _d !== void 0 ? _d : 'N/A'}`,
            `userId: ${(_e = error.userId) !== null && _e !== void 0 ? _e : 'N/A'}`
        ];
        return logMessage.join('\n');
    }
}
// Define the error handler service
let ErrorHandlerService = (() => {
    let _classDecorators = [(0, typedi_1.Service)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ErrorHandlerService = _classThis = class {
        constructor(logger) {
            this.logger = logger;
            this.errorChains = new Map();
        }
        log(error) {
            if (error instanceof Errors_1.default) {
                const logStrategy = this.getLogStrategy(error);
                const logMessage = logStrategy.getLogMessage(error);
                this.logger.error(logMessage);
            }
            else {
                this.logger.error(`Unhandled error: ${error.message}`);
            }
        }
        getLogStrategy(error) {
            if (error instanceof Errors_1.DatabaseError) {
                return new DatabaseErrorLogStrategy();
            }
            else if (error instanceof Errors_1.ClientAuthError) {
                return new ClientAuthErrorLogStrategy();
            }
            else {
                return new DefaultLogStrategy();
            }
        }
        _handleError(error) {
            if (this.errorChains.has(error.traceId)) {
                error.cause = this.errorChains.get(error.traceId);
            }
            this.errorChains.set(error.traceId, error);
            this.log(error);
        }
        getDefinedBaseError(traceId) {
            if (this.errorChains.has(traceId)) {
                let chain = this.errorChains.get(traceId);
                let rootBaseError = chain;
                while ((chain === null || chain === void 0 ? void 0 : chain.cause) && chain.cause instanceof Errors_1.default) {
                    rootBaseError = chain;
                    chain = chain.cause;
                }
                return rootBaseError;
            }
            return null;
        }
        handleError({ error, service, req }) {
            this.logger.setServiceName(service);
            if (error instanceof Errors_1.DatabaseError) {
                this._handleError(error);
            }
            else if (error instanceof Errors_1.ServiceError) {
                this._handleError(error);
            }
            else if (error instanceof Errors_1.ControllerError) {
                this._handleError(error);
            }
            else if (error instanceof Errors_1.ServerError) {
                this._handleError(error);
            }
            else if (error instanceof Errors_1.ClientAuthError) {
                this._handleError(error);
            }
            else if (error instanceof Errors_1.ValidationError) {
                this._handleError(error);
            }
            else if (error instanceof Errors_1.ExportError) {
                this._handleError(error);
            }
            else {
                const serverError = new Errors_1.ServerError({
                    message: `Unhandled error: ${error.message}`
                });
                serverError.cause = error;
                this._handleError(serverError);
            }
        }
        handleUnknownDatabaseError({ error, service, query, errorType }) {
            const unhandledDbError = new errorType({
                query,
                cause: error
            });
            this.handleError({
                error: unhandledDbError,
                service: service,
                query: query
            });
            return unhandledDbError;
        }
        handleUnknownServiceError({ error, service, errorType }) {
            const unhandledServiceError = new errorType({
                cause: error
            });
            this.handleError({
                error: unhandledServiceError,
                service: service
            });
            return unhandledServiceError;
        }
        handleUnknownControllerError({ error, service, errorType }) {
            const unhandledControllerError = new errorType({
                cause: error
            });
            this.handleError({
                error: unhandledControllerError,
                service: service
            });
            return unhandledControllerError;
        }
        handleUnknownServerError({ error, service, errorType }) {
            const unhandledServerError = new errorType({
                cause: error
            });
            this.handleError({
                error: unhandledServerError,
                service: service
            });
            return unhandledServerError;
        }
        handleUnknownError({ error, service }) {
            this.handleError({
                error: error,
                service: service
            });
        }
    };
    __setFunctionName(_classThis, "ErrorHandlerService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ErrorHandlerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ErrorHandlerService = _classThis;
})();
exports.default = ErrorHandlerService;
