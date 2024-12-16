"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: false, // No need for timestamps on individual items
    _id: true, // Each order item has its own ID
});
const OrderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop", required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "canceled"],
        required: true,
    },
    items: [{ type: OrderItemSchema, required: false }], // Embedded array of order items
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment", required: false },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});
// Create models
exports.Order = (0, mongoose_1.model)("Order", OrderSchema);
exports.OrderItem = (0, mongoose_1.model)("OrderItem", OrderItemSchema);
