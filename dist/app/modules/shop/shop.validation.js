"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopValidationSchema = void 0;
const zod_1 = require("zod");
exports.ShopValidationSchema = {
    createShopSchema: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Shop name is required" }),
        logo: zod_1.z.string().url().optional(),
        description: zod_1.z.string().optional(),
        vendorId: zod_1.z.string().min(1, { message: "Vendor ID is required" }), // Add vendorId here
    }),
    updateShopSchema: zod_1.z.object({
        name: zod_1.z.string().optional(),
        logo: zod_1.z.string().url().optional(),
        description: zod_1.z.string().optional(),
    }),
};
