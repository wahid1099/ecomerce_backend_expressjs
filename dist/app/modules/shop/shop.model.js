"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shop = exports.ShopFollower = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model"); // Import User model
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
// Post-save middleware to add the shop to the user's shops array
ShopSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_model_1.User.findByIdAndUpdate(doc.vendorId, { $push: { shops: doc._id } }, // Add the shop's ID to the user's shops array
            { new: true });
            next();
        }
        catch (err) {
            next();
        }
    });
});
// Export the Shop model
exports.Shop = (0, mongoose_1.model)("Shop", ShopSchema);
