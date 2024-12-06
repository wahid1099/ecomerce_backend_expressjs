"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message = "An error occurred", stack = "") {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ApiError;
