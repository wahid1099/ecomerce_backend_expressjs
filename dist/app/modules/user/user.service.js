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
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const shop_model_1 = require("../shop/shop.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username } = userData;
    // Check for duplicate email or username
    const existingUser = yield user_model_1.User.findOne({
        $or: [{ email }, { username }],
    });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User with this email or username already exists");
    }
    // Create the user (password will be hashed by the pre-save hook)
    const newUser = new user_model_1.User(userData);
    const result = yield newUser.save(); // Pre-save hook automatically hashes the password
    return result;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    Object.assign(existingUser, payload);
    yield existingUser.save();
    return existingUser;
});
const getMyProfileService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email, isDeleted: false })
        .populate({
        path: "shop",
        options: { strictPopulate: false }, // Handle missing shops gracefully
        populate: {
            path: "shopFollowers", // Populate followers of the shop
            model: "User", // Reference to the User model
            select: "name email", // Fetch only specific fields if needed
            options: { strictPopulate: false }, // Handle missing followers gracefully
        },
    })
        .populate({
        path: "orders",
        options: { strictPopulate: false }, // Handle missing orders gracefully
        populate: {
            path: "items.product", // Path to the product field in the items array
            model: "Product", // Name of the model to populate
            options: { strictPopulate: false }, // Handle missing products gracefully
        },
    })
        .populate({ path: "reviews", options: { strictPopulate: false } }) // Handle missing reviews gracefully
        .populate({ path: "payments", options: { strictPopulate: false } }); // Handle missing reviews gracefully
    if (!user) {
        // Throw a custom error if user not found
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Return the user with populated data
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find()
        .populate({ path: "shop", options: { strictPopulate: false } }) // Handle missing shops gracefully
        .populate({ path: "orders", options: { strictPopulate: false } }); // Handle missing orders gracefully
    // .populate({ path: "reviews", options: { strictPopulate: false } }) // Handle missing reviews gracefully
    // .populate({ path: "payments", options: { strictPopulate: false } }); // Handle missing payments gracefully
    return users;
});
const toggleUserDeletion = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // If the user is already deleted, restore them by setting isDeleted to false.
    if (user.isDeleted) {
        user.isDeleted = false;
        yield user.save();
        return user;
    }
    // If the user is not deleted, mark them as deleted.
    user.isDeleted = true;
    yield user.save();
    return user;
});
const suspendVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists and is a vendor
    const user = yield user_model_1.User.findById(vendorId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Vendor not found");
    }
    if (user.role !== "Vendor") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User is not a vendor");
    }
    // Toggle the `isSuspended` status
    if (user.isSuspended) {
        user.isSuspended = false; // Unsuspend the vendor
    }
    else {
        user.isSuspended = true; // Suspend the vendor
    }
    yield user.save();
    return user;
});
const getUserFollowedShops = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).populate({
        path: "followedShops", // Populate the array of ShopFollower references
        populate: {
            path: "shop", // Populate the shop field inside each ShopFollower
            select: "name description", // Optional: you can specify which fields to select from the Shop model
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
const followShopToggle = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // Convert string IDs to ObjectId
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const shopObjectId = new mongoose_1.default.Types.ObjectId(shopId);
    // Fetch user and shop documents
    const user = yield user_model_1.User.findById(userObjectId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const shop = yield shop_model_1.Shop.findById(shopObjectId);
    if (!shop) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Shop not found");
    }
    // Check if the user already follows the shop
    const isUserFollowingShop = (_a = user.followedShops) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === shopObjectId.toString());
    const isShopFollowedByUser = (_b = shop.followers) === null || _b === void 0 ? void 0 : _b.some((id) => id.toString() === userObjectId.toString());
    // Data consistency validation
    if (isUserFollowingShop !== isShopFollowedByUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Data inconsistency detected between user and shop");
    }
    if (isUserFollowingShop) {
        // Unfollow the shop
        user.followedShops = (_c = user.followedShops) === null || _c === void 0 ? void 0 : _c.filter((id) => id.toString() !== shopObjectId.toString());
        shop.followers = (_d = shop.followers) === null || _d === void 0 ? void 0 : _d.filter((id) => id.toString() !== userObjectId.toString());
    }
    else {
        // Follow the shop
        user.followedShops = user.followedShops || [];
        shop.followers = shop.followers || [];
        user.followedShops.push(shopObjectId);
        shop.followers.push(userObjectId);
    }
    // Save changes
    yield user.save();
    yield shop.save();
    return {
        isFollowed: !isUserFollowingShop,
        user,
        shop,
    };
});
exports.UserService = {
    createUser,
    getAllUsers,
    getMyProfileService,
    updateUser,
    toggleUserDeletion,
    suspendVendor,
    getUserFollowedShops,
    followShopToggle,
};
