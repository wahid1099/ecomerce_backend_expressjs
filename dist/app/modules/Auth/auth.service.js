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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthServices = void 0;
const jwthelpers_1 = require("../../../helpers/jwthelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const ApiErros_1 = __importDefault(require("../../errors/ApiErros"));
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: payload.email, isDeleted: false },
    });
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    const isPasswordValid = yield bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ApiErros_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    const accessToken = jwthelpers_1.jwtHelpers.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwthelpers_1.jwtHelpers.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedData = jwthelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    if (!decodedData) {
        throw new ApiErros_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token!");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { email: decodedData.email, isDeleted: false },
    });
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.FORBIDDEN, "User not found!");
    }
    const accessToken = jwthelpers_1.jwtHelpers.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { accessToken, needPasswordChange: user.needPasswordChange };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: user.email, isDeleted: false },
    });
    if (!existingUser) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const isPasswordValid = yield bcrypt.compare(payload.oldPassword, existingUser.password);
    if (!isPasswordValid) {
        throw new ApiErros_1.default(http_status_1.default.UNAUTHORIZED, "Old password is incorrect!");
    }
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: { email: user.email },
        data: { password: hashedPassword, needPasswordChange: false },
    });
    return { message: "Password changed successfully!" };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: payload.email, isDeleted: false },
    });
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const resetPassToken = jwthelpers_1.jwtHelpers.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = `${config_1.default.reset_pass_link}?userId=${user.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)(user.email, `
      <div>
        <p>Dear User,</p>
        <p>Your password reset link:</p>
        <a href="${resetPassLink}">Reset Password</a>
      </div>
    `);
    return { message: "Password reset link sent to your email." };
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedData = jwthelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!decodedData) {
        throw new ApiErros_1.default(http_status_1.default.FORBIDDEN, "Invalid reset password token!");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { id: payload.id, isDeleted: false },
    });
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const hashedPassword = yield bcrypt.hash(payload.password, 12);
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
    return { message: "Password reset successfully!" };
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
