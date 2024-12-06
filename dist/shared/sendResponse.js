"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, jsonData) => {
    const { statusCode, success, message, data, pagination } = jsonData;
    res.status(statusCode).json({
        success,
        status: statusCode,
        message,
        data: data || null,
        pagination: pagination || null,
    });
};
exports.default = sendResponse;
