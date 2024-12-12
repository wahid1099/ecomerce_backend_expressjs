"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductImage = void 0;
const mongoose_1 = require("mongoose");
// Define the ProductImage schema
const ProductImageSchema = new mongoose_1.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false, // No automatic timestamps
    _id: true, // Each image has its own ID
});
exports.ProductImage = (0, mongoose_1.model)("ProductImage", ProductImageSchema);
// Define the Product schema
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    inventory: {
        type: Number,
        required: true,
    },
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    images: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ProductImage",
        },
    ],
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
}, {
    timestamps: true, // Automatically add createdAt and updatedAt
});
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
