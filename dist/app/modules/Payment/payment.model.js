"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: {
        type: String,
        enum: ["card", "bank_transfer", "cash_on_delivery"],
        required: true,
    },
    status: {
        type: String,
        enum: ["success", "failed", "pending"],
        required: true,
    },
    transactionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Transaction" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
const Payment = (0, mongoose_1.model)("Payment", PaymentSchema);
exports.default = Payment;
