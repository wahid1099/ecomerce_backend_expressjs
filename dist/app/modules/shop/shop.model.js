"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shop = exports.ShopFollower = void 0;
const mongoose_1 = require("mongoose");
// Define the ShopFollower schema
const ShopFollowerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    isBlacklisted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false, // Explicitly handle createdAt, no updatedAt needed
    _id: true,
});
exports.ShopFollower = (0, mongoose_1.model)("ShopFollower", ShopFollowerSchema);
// Define the Shop schema
const ShopSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    logo: {
        type: String,
        default: null,
    },
    vendorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isBlacklisted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    orders: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    shopFollowers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ShopFollower",
        },
    ],
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});
// Middleware to update timestamps
ShopSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});
// Export the Shop model
exports.Shop = (0, mongoose_1.model)("Shop", ShopSchema);
