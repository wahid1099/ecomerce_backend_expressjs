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
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const ApiErros_1 = __importDefault(require("../../errors/ApiErros"));
const http_status_1 = __importDefault(require("http-status"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username } = userData;
    // Check for duplicate email or username
    const existingUser = yield user_model_1.User.findOne({
        $or: [{ email }, { username }],
    });
    if (existingUser) {
        throw new ApiErros_1.default(http_status_1.default.CONFLICT, "User with this email or username already exists");
    }
    // Create the user (password will be hashed by the pre-save hook)
    const newUser = new user_model_1.User(userData);
    const result = yield newUser.save(); // Pre-save hook automatically hashes the password
    return result;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    Object.assign(existingUser, payload);
    yield existingUser.save();
    return existingUser;
});
const getMyProfileService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email, isDeleted: false })
        .populate("shops") // Populating the 'shops' field (assuming it's an array of ObjectIds referencing the Shop model)
        .populate("orders") // Populating the 'orders' field (assuming it's an array of ObjectIds referencing the Order model)
        .populate("reviews") // Populating the 'reviews' field (assuming it's an array of ObjectIds referencing the Review model)
        .populate("followedShops") // Populating the 'followedShops' field (assuming it's an array of ObjectIds referencing the Shop model)
        .populate("shopFollowers") // Populating the 'shopFollowers' field (assuming it's an array of ObjectIds referencing the Shop model)
        .populate("payments"); // Populating the 'payments' field (assuming it's an array of ObjectIds referencing the Payment model)
    // Check if the user was found
    if (!user) {
        // Throw a custom error if user not found
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Return the user with populated data
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find()
        .populate("shops")
        .populate("orders")
        .populate("reviews")
        .populate("followedShops")
        .populate("shopFollowers")
        .populate("payments");
    return users;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    user.isDeleted = true;
    yield user.save();
    return user;
});
const suspendVendor = (vendorId, isSuspended) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists and is a vendor
    const user = yield user_model_1.User.findById(vendorId);
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Vendor not found");
    }
    if (user.role !== "Vendor") {
        throw new ApiErros_1.default(http_status_1.default.BAD_REQUEST, "User is not a vendor");
    }
    user.isSuspended = isSuspended;
    yield user.save();
    return user;
});
const getUserFollowedShops = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).populate({
        path: "followedShops",
        populate: {
            path: "shop",
        },
    });
    if (!user || !user.followedShops) {
        return [];
    }
    return user.followedShops.map((record) => ({
        id: record.shop._id,
        name: record.shop.name,
        description: record.shop.description,
    }));
});
exports.UserService = {
    createUser,
    getAllUsers,
    getMyProfileService,
    updateUser,
    deleteUser,
    suspendVendor,
    getUserFollowedShops,
};
