"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidationSchema = void 0;
const zod_1 = require("zod");
exports.ProductValidationSchema = {
    createProductSchema: zod_1.z.object({
        name: zod_1.z.string().nonempty("Product name is required"),
        slug: zod_1.z.string().nonempty("Product slug is required"),
        price: zod_1.z.number().positive("Price must be greater than zero"),
        category: zod_1.z.string().nonempty("Category is required"),
        inventory: zod_1.z.number().int().min(0, "Inventory count cannot be negative"),
        images: zod_1.z
            .array(zod_1.z.string().url())
            .nonempty("At least one image is required"),
        description: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
        variants: zod_1.z
            .array(zod_1.z.object({
            name: zod_1.z.string().nonempty("Variant name is required"),
            options: zod_1.z
                .array(zod_1.z.string())
                .min(1, "At least one option is required"),
            stock: zod_1.z.record(zod_1.z.string(), zod_1.z.number().min(0)), // Stock as a map of option -> quantity
            price: zod_1.z.number().positive().optional(),
            images: zod_1.z.array(zod_1.z.string().url()).optional(),
        }))
            .optional(),
    }),
    updateProductSchema: zod_1.z.object({
        name: zod_1.z.string().optional(),
        slug: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        category: zod_1.z.string().optional(),
        inventoryCount: zod_1.z.number().int().min(0).optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        description: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
        variants: zod_1.z
            .array(zod_1.z.object({
            name: zod_1.z.string().optional(),
            options: zod_1.z.array(zod_1.z.string()).optional(),
            stock: zod_1.z.record(zod_1.z.string(), zod_1.z.number().min(0)).optional(),
            price: zod_1.z.number().positive().optional(),
            images: zod_1.z.array(zod_1.z.string().url()).optional(),
        }))
            .optional(),
    }),
};
