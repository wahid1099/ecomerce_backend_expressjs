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
exports.ShopController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const shop_service_1 = require("./shop.service");
const http_status_1 = __importDefault(require("http-status"));
const createShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("createShop",req.body);
    const result = yield shop_service_1.ShopServices.createShop(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Shop created successfully!",
        data: result,
    });
}));
const updateShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const shopId = req.params.shopId;
    const result = yield shop_service_1.ShopServices.updateShop(shopId, vendorId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop updated successfully!",
        data: result,
    });
}));
const getSingleShopData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shopId = req.params.shopId;
    const result = yield shop_service_1.ShopServices.getSingleShopFromDb(shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop Fetched successfully!",
        data: result,
    });
}));
const getVendorShops = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const vendorId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const result = yield shop_service_1.ShopServices.getVendorShops(vendorId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Vendor shops fetched successfully!",
        data: result,
    });
}));
const deleteShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const vendorId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const shopId = req.params.shopId;
    const result = yield shop_service_1.ShopServices.deleteShop(shopId, vendorId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop deleted successfully!",
        data: result,
    });
}));
const getShopOrderHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const vendorId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    const shopId = req.params.shopId;
    const result = yield shop_service_1.ShopServices.getShopOrderHistory(shopId, vendorId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order history fetched successfully!",
        data: result,
    });
}));
// const followShop = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.id; // Assuming user ID is in the request
//   const { shopId } = req.params;
//   const result = await ShopServices.followShop(userId, shopId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Order history fetched successfully!",
//     data: result,
//   });
// });
// const unfollowShop = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.user?.id; // Assuming user ID is in the request
//   const { shopId } = req.params;
//   const result = await ShopServices.unfollowShop(userId, shopId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Order history fetched successfully!",
//     data: result,
//   });
// });
// const getShopFollowers = catchAsync(async (req: Request, res: Response) => {
//   const { shopId } = req.params;
//   const result = await ShopServices.getShopFollowers(shopId);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Order history fetched successfully!",
//     data: result,
//   });
// });
exports.ShopController = {
    createShop,
    updateShop,
    getVendorShops,
    deleteShop,
    getShopOrderHistory,
    // followShop,
    // unfollowShop,
    // getShopFollowers,
    getSingleShopData,
};
