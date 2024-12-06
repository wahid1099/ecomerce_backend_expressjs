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
exports.ShopServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErros_1 = __importDefault(require("../../errors/ApiErros"));
const http_status_1 = __importDefault(require("http-status"));
const createShop = (vendorId, shopData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, shopData), { ownerId: vendorId }),
    });
    return shop;
});
const updateShop = (shopId, vendorId, shopData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.updateMany({
        where: {
            id: shopId,
            ownerId: vendorId,
        },
        data: shopData,
    });
    if (!shop.count) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found or you don't have permission to edit this shop.");
    }
    return shop;
});
const getVendorShops = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const shops = yield prisma_1.default.shop.findMany({
        where: {
            ownerId: vendorId,
        },
    });
    return shops;
});
const deleteShop = (shopId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedShop = yield prisma_1.default.shop.deleteMany({
        where: {
            id: shopId,
            ownerId: vendorId,
        },
    });
    if (!deletedShop.count) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found or you don't have permission to edit this shop.");
    }
    return deletedShop;
});
const getShopOrderHistory = (shopId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.findMany({
        where: {
            shopId,
            shop: { ownerId: vendorId },
        },
    });
    return orders;
});
const followShop = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if shop exists
    const shop = yield prisma_1.default.shop.findUniqueOrThrow({
        where: { id: shopId },
    });
    if (!shop.count) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found .");
    }
    // Add the shop to the user's followedShops
    yield prisma_1.default.shopFollower.create({
        data: {
            userId,
            shopId,
        },
    });
    return {
        message: `You are now following the shop ${shop.name}.`,
    };
});
const unfollowShop = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is following the shop
    const followRecord = yield prisma_1.default.shopFollower.findFirst({
        where: {
            userId,
            shopId,
        },
    });
    if (!followRecord) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found .");
    }
    // Remove the follow relationship
    yield prisma_1.default.shopFollower.delete({
        where: {
            id: followRecord.id,
        },
    });
    return {
        message: `You have unfollowed the shop.`,
    };
});
const getShopFollowers = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const followers = yield prisma_1.default.shopFollower.findMany({
        where: { shopId },
        include: {
            user: true, // Include user details
        },
    });
    return followers.map((follower) => ({
        id: follower.user.id,
        name: follower.user.name,
        email: follower.user.email,
        profileImage: follower.user.profileImage,
    }));
});
exports.ShopServices = {
    createShop,
    updateShop,
    getVendorShops,
    deleteShop,
    getShopOrderHistory,
    followShop,
    unfollowShop,
    getShopFollowers,
};
