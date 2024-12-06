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
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErros_1 = __importDefault(require("../../errors/ApiErros"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, username, password, role } = userData;
    if (!name || !email || !username || !password || !role) {
        throw new ApiErros_1.default(http_status_1.default.BAD_REQUEST, "Missing required fields");
    }
    // Check for duplicate email or username
    const existingUser = yield prisma_1.default.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });
    if (existingUser) {
        throw new ApiErros_1.default(http_status_1.default.CONFLICT, "User with this email or username already exists");
    }
    // Hash the password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Create the user
    const newUser = yield prisma_1.default.user.create({
        data: {
            name,
            email,
            username,
            password: hashedPassword,
            role,
            city: userData.city || null,
            state: userData.state || null,
            zip: userData.zipCode || null,
            country: userData.country || null,
            phone: userData.phone || null,
        },
    });
    return newUser;
});
const updateUser = (UserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: {
            id: UserId,
        },
    });
    if (!existingUser) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: UserId,
        },
        data: payload,
    });
    return updatedUser;
});
const getMyProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId, isDeleted: false },
        include: {
            shops: true,
            orders: true,
            reviews: true,
            followedShops: true,
            shopFollowers: true,
            payments: true,
        },
    });
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        include: {
            shops: true,
            orders: true,
            reviews: true,
            followedShops: true,
            shopFollowers: true,
            payments: true,
        },
    });
    return users;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!userExists) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { isDeleted: true },
    });
    return updatedUser;
});
const suspendVendor = (vendorId, isSuspended) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists and is a vendor
    const user = yield prisma_1.default.user.findUnique({
        where: { id: vendorId },
    });
    if (!user) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Vendor not found");
    }
    if (user.role !== "vendor") {
        throw new ApiErros_1.default(http_status_1.default.BAD_REQUEST, "User is not a vendor");
    }
    // Update the `isSuspended` status
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: vendorId },
        data: { isSuspended },
    });
    return updatedUser;
});
const getUserFollowedShops = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const followedShops = yield prisma_1.default.shopFollower.findMany({
        where: { userId },
        include: {
            shop: true, // Include shop details
        },
    });
    return followedShops.map((record) => ({
        id: record.shop.id,
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
