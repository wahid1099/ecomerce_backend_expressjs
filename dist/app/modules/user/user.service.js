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
    const { name, email, username, password, role } = userData;
    if (!name || !email || !username || !password || !role) {
        throw new ApiErros_1.default(http_status_1.default.BAD_REQUEST, "Missing required fields");
    }
    // Check for duplicate email or username
    const existingUser = yield user_model_1.User.findOne({
        $or: [{ email }, { username }],
    });
    if (existingUser) {
        throw new ApiErros_1.default(http_status_1.default.CONFLICT, "User with this email or username already exists");
    }
    // Create the user (password will be hashed by the pre-save hook)
    const newUser = new user_model_1.User({
        name,
        email,
        username,
        password, // Raw password is passed here; the hook will hash it.
        role,
        city: userData.city || null,
        state: userData.state || null,
        zipCode: userData.zipCode || null,
        country: userData.country || null,
        phone: userData.phone || null,
    });
    yield newUser.save(); // Pre-save hook automatically hashes the password
    return newUser;
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
const getMyProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: userId, isDeleted: false })
        .populate("shops")
        .populate("orders")
        .populate("reviews")
        .populate("followedShops")
        .populate("shopFollowers")
        .populate("payments");
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
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
