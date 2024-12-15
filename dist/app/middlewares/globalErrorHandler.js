"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    // Default status code to 500 if not provided
    const statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong!",
        error: {
            statusCode,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace in development mode
        },
    });
};
exports.default = globalErrorHandler;
