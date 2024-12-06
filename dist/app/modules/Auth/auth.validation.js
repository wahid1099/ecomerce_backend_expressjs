"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidationSchema = void 0;
const zod_1 = require("zod");
exports.AuthValidationSchema = {
    loginSchema: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: zod_1.z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
    }),
    changePasswordSchema: zod_1.z.object({
        oldPassword: zod_1.z.string(),
        newPassword: zod_1.z
            .string()
            .min(6, { message: "New password must be at least 6 characters" }),
    }),
    forgotPasswordSchema: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
    }),
    resetPasswordSchema: zod_1.z.object({
        password: zod_1.z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
    }),
};
