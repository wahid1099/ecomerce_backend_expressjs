"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
// OrderItem Schema
const OrderItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
});
// Order Schema
const OrderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop", required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "canceled"],
        required: true,
    },
    items: { type: [OrderItemSchema], required: true }, // Embedded array of order items
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
// Create models
exports.Order = (0, mongoose_1.model)("Order", OrderSchema);
