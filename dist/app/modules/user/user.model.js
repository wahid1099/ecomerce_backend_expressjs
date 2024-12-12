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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// Define User Schema
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("./user.interface");
const index_1 = __importDefault(require("../../../config/index"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Name is required"] },
    username: { type: String, unique: true },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: function (value) {
                // Simple regex for email validation
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: "Invalid email format",
        },
    },
    password: { type: String, required: [true, "Password is required"] },
    profileImage: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    phone: { type: String },
    addressBook: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.UserRole),
        required: [true, "Role is required"],
    },
    isSuspended: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    lastLoginDevice: { type: String },
    lastLoginLocation: { type: String },
    passwordChangedAt: { type: Date, required: true, default: Date.now },
}, { timestamps: true } // Automatically handle createdAt and updatedAt
);
// Pre-save hook to hash the password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, Number(index_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
// Post-save hook to remove the password from the returned document
userSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        doc.password = "";
        next();
    });
});
// Transform output to remove sensitive fields
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    },
});
// Static method to check if a user exists by email
userSchema.statics.isUserExistByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ email });
    });
};
// Static method to check if the password matches
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
// Create and export the User model
exports.User = (0, mongoose_1.model)("User", userSchema);
