"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchema = void 0;
const zod_1 = require("zod");
const UserSchemaCreate = zod_1.z.object({
    name: zod_1.z.string().optional(),
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(50, { message: "Username must be less than 50 characters" })
        .optional(),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be less than 100 characters" }),
    role: zod_1.z.enum(["Admin", "Vendor", "Customer"], { message: "Invalid role" }),
    profileImage: zod_1.z
        .string()
        .url({ message: "Invalid profile image URL" })
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[0-9]\d{1,14}$/, { message: "Invalid phone number" })
        .optional(),
    addressBook: zod_1.z.string().optional(),
    zipCode: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
const UserSchemaUpdate = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name must not be empty" })
        .max(100, { message: "Name must be less than 100 characters" })
        .optional(),
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(50, { message: "Username must be less than 50 characters" })
        .optional(),
    email: zod_1.z.string().email({ message: "Invalid email address" }).optional(),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(100, { message: "Password must be less than 100 characters" })
        .optional(),
    role: zod_1.z
        .enum(["admin", "vendor", "customer"], { message: "Invalid role" })
        .optional(),
    profileImage: zod_1.z
        .string()
        .url({ message: "Invalid profile image URL" })
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" })
        .optional(),
    addressBook: zod_1.z.string().optional(),
    zipCode: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    isSuspended: zod_1.z.boolean().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.UserValidationSchema = {
    UserSchemaCreate,
    UserSchemaUpdate,
};
