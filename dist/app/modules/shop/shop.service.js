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
const shop_model_1 = require("./shop.model");
const order_model_1 = require("../order/order.model");
const ApiErros_1 = __importDefault(require("../../errors/ApiErros"));
const http_status_1 = __importDefault(require("http-status"));
const createShop = (vendorId, shopData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_model_1.Shop.create(Object.assign(Object.assign({}, shopData), { vendorId }));
    return shop;
});
const updateShop = (shopId, vendorId, shopData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_model_1.Shop.findOneAndUpdate({ _id: shopId, vendorId }, shopData, { new: true });
    if (!shop) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found or you don't have permission to edit this shop.");
    }
    return shop;
});
const getVendorShops = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const shops = yield shop_model_1.Shop.find({ vendorId });
    return shops;
});
const deleteShop = (shopId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_model_1.Shop.findOneAndDelete({ _id: shopId, vendorId });
    if (!shop) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found or you don't have permission to delete this shop.");
    }
    return shop;
});
const getShopOrderHistory = (shopId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({ shopId, vendorId });
    return orders;
});
const followShop = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if shop exists
    const shop = yield shop_model_1.Shop.findById(shopId);
    if (!shop) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found.");
    }
    // Check if already following
    const isAlreadyFollowing = yield shop_model_1.ShopFollower.findOne({ userId, shopId });
    if (isAlreadyFollowing) {
        throw new ApiErros_1.default(http_status_1.default.BAD_REQUEST, "Already following this shop.");
    }
    // Add the shop to the user's followedShops
    yield shop_model_1.ShopFollower.create({ userId, shopId });
    return {
        message: `You are now following the shop ${shop.name}.`,
    };
});
const unfollowShop = (userId, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is following the shop
    const followRecord = yield shop_model_1.ShopFollower.findOne({ userId, shopId });
    if (!followRecord) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Shop not found.");
    }
    // Remove the follow relationship
    yield shop_model_1.ShopFollower.findByIdAndDelete(followRecord._id);
    return {
        message: `You have unfollowed the shop.`,
    };
});
const getShopFollowers = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const followers = yield shop_model_1.ShopFollower.find({ shopId }).populate("user");
    return followers.map((follower) => {
        var _a, _b, _c, _d;
        return ({
            id: (_a = follower.user) === null || _a === void 0 ? void 0 : _a._id,
            name: (_b = follower.user) === null || _b === void 0 ? void 0 : _b.name,
            email: (_c = follower.user) === null || _c === void 0 ? void 0 : _c.email,
            profileImage: (_d = follower.user) === null || _d === void 0 ? void 0 : _d.profileImage,
        });
    });
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
