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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const ApiErros_1 = __importDefault(require("../errors/ApiErros"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const Auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
            throw new ApiErros_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const token = authHeader.split("Bearer ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.jwt_secret);
            // Check if the role is valid
            if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
                throw new ApiErros_1.default(http_status_1.default.FORBIDDEN, "You do not have permission to access this route!");
            }
            req.user = decoded; // Attach decoded token to the request
            next();
        }
        catch (error) {
            throw new ApiErros_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token!");
        }
    }));
};
exports.default = Auth;
