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
const user_model_1 = require("../user/user.model");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const emailSender_1 = __importDefault(require("./emailSender"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email, isDeleted: false });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    // Check if the provided password matches the hashed password in the database
    const isPasswordValid = yield bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials!");
    }
    // Generate JWT tokens
    const accessToken = jwthelpers_1.jwtHelpers.generateToken(Object.assign(Object.assign({}, user.toObject()), { password: undefined }), config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    // Generate refresh tokens
    const refreshToken = jwthelpers_1.jwtHelpers.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    // Update user's last login timestamp
    user.lastLoginAt = new Date(); // Set the current date and time
    yield user.save(); // Save the updated user document
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedData = jwthelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    if (!decodedData) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token!");
    }
    const user = yield user_model_1.User.findOne({
        email: decodedData.email,
        isDeleted: false,
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User not found!");
    }
    const accessToken = jwthelpers_1.jwtHelpers.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { accessToken };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findOne({
        email: user.email,
        isDeleted: false,
    });
    if (!existingUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const isPasswordValid = yield bcrypt.compare(payload.oldPassword, existingUser.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Old password is incorrect!");
    }
    existingUser.password = payload.newPassword; // Will be hashed automatically by pre-save hook
    yield existingUser.save();
    return { message: "Password changed successfully!" };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email, isDeleted: false });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
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
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid reset password token!");
    }
    const user = yield user_model_1.User.findOne({ _id: payload.id, isDeleted: false });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    user.password = payload.password; // Will be hashed automatically by pre-save hook
    yield user.save();
    return { message: "Password reset successfully!" };
});
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
