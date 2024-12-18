"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
const Coupon = (0, mongoose_1.model)("Coupon", couponSchema);
exports.default = Coupon;
