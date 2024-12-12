"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidationSchema = void 0;
const zod_1 = require("zod");
exports.ProductValidationSchema = {
    createProductSchema: zod_1.z.object({
        name: zod_1.z.string().nonempty("Product name is required"),
        price: zod_1.z.number().positive("Price must be greater than zero"),
        category: zod_1.z.string().nonempty("Category is required"),
        inventoryCount: zod_1.z
            .number()
            .int()
            .min(0, "Inventory count cannot be negative"),
        images: zod_1.z
            .array(zod_1.z.string().url())
            .nonempty("At least one image is required"),
        description: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
    }),
    updateProductSchema: zod_1.z.object({
        name: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        category: zod_1.z.string().optional(),
        inventoryCount: zod_1.z.number().int().min(0).optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        description: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).max(100).optional(),
    }),
};
