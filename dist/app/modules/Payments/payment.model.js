"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
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
    transactionId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});
exports.Payment = (0, mongoose_1.model)("Payment", PaymentSchema);
