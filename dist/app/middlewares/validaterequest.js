"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const http_status_1 = __importDefault(require("http-status"));
const validateRequest = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.parseAsync(req.body);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            const errors = err.errors.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }));
            res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                statusCode: http_status_1.default.BAD_REQUEST,
                message: "Validation failed",
                errors,
            });
        }
        else {
            next(err); // Pass other errors to the error-handling middleware
        }
    }
});
exports.default = validateRequest;
