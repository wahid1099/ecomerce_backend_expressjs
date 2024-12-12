"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Product price must be a positive number"],
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
    },
    inventory: {
        type: Number,
        required: [true, "Inventory count is required"],
        min: [0, "Inventory count must be a positive number"],
    },
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop",
        required: [true, "Shop ID is required"],
    },
    images: {
        type: [String],
        default: [],
    },
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    orderItems: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "OrderItem",
        },
    ],
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
