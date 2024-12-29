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
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createShop = (shopData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_model_1.Shop.create(Object.assign({}, shopData));
    return shop;
});
const updateShop = (shopId, vendorId, shopData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_model_1.Shop.findOneAndUpdate({ _id: shopId, vendorId }, shopData, { new: true });
    if (!shop) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Shop not found or you don't have permission to edit this shop.");
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
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Shop not found or you don't have permission to delete this shop.");
    }
    return shop;
});
const getShopOrderHistory = (shopId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({ shopId, vendorId });
    return orders;
});
// const followShop = async (userId: string, shopId: string) => {
//   // Check if shop exists
//   const shop = await Shop.findById(shopId);
//   if (!shop) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Shop not found.");
//   }
//   // Check if already following
//   const isAlreadyFollowing = await ShopFollower.findOne({ userId, shopId });
//   if (isAlreadyFollowing) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Already following this shop.");
//   }
//   // Add the shop to the user's followedShops
//   await ShopFollower.create({ userId, shopId });
//   return {
//     message: `You are now following the shop ${shop.name}.`,
//   };
// };
// const unfollowShop = async (userId: string, shopId: string) => {
//   // Check if the user is following the shop
//   const followRecord = await ShopFollower.findOne({ userId, shopId });
//   if (!followRecord) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Shop not found.");
//   }
//   // Remove the follow relationship
//   await ShopFollower.findByIdAndDelete(followRecord._id);
//   return {
//     message: `You have unfollowed the shop.`,
//   };
// };
// const getShopFollowers = async (shopId: string) => {
//   const followers = await ShopFollower.find({ shop: shopId })
//     .populate<{ user: IUser }>("user") // Explicitly set the type of 'user' to IUser
//     .exec(); // Adding exec() ensures it's properly executed
//   return followers.map((follower) => ({
//     id: follower.user?._id,
//     name: follower.user?.name,
//     email: follower.user?.email,
//     profileImage: follower.user?.profileImage,
//   }));
// };
const getSingleShopFromDb = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const shopData = yield shop_model_1.Shop.findOne({ _id: shopId }).populate("products");
    if (!shopData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Shop not found");
    }
    return shopData;
});
const getAllShopsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const shopData = yield shop_model_1.Shop.find().populate("products");
    return shopData;
});
const BlackListShopInDb = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists and is a vendor
    const shop = yield shop_model_1.Shop.findById(vendorId);
    if (!shop) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Shop not found");
    }
    // Toggle the `isSuspended` status
    if (shop.isBlacklisted) {
        shop.isBlacklisted = false; // Unsuspend the vendor
    }
    else {
        shop.isBlacklisted = true; // Suspend the vendor
    }
    yield shop.save();
    return shop;
});
exports.ShopServices = {
    createShop,
    updateShop,
    getVendorShops,
    deleteShop,
    getShopOrderHistory,
    // followShop,
    // unfollowShop,
    // getShopFollowers,
    getSingleShopFromDb,
    getAllShopsFromDb,
    BlackListShopInDb,
};
