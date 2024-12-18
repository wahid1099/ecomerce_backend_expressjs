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
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const inserUserIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User created successfully",
        data: newUser,
    });
}));
const getAllUsersfromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User retrieved successfully",
        data: result,
    });
}));
const getMyprofilefromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.user.email;
    const result = yield user_service_1.UserService.getMyProfileService(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User retrieved successfully",
        data: result,
    });
}));
const updateUserIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserService.updateUser(userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User updated successfully",
        data: result,
    });
}));
const deleteUserfromDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserService.deleteUser(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User successfully deleted",
    });
});
const suspendVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorId } = req.params;
    const { isSuspended } = req.body;
    // Validate that `isSuspended` is provided and is a boolean
    if (typeof isSuspended !== "boolean") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "isSuspended must be a boolean");
    }
    const result = yield user_service_1.UserService.suspendVendor(vendorId, isSuspended);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: `Vendor ${isSuspended ? "suspended" : "unsuspended"} successfully`,
        data: result,
    });
}));
const getUserFollowedShops = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming user ID is in the request
    const result = yield user_service_1.UserService.getUserFollowedShops(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        data: result,
    });
}));
exports.UserController = {
    inserUserIntoDB,
    getAllUsersfromDb,
    getMyprofilefromDb,
    updateUserIntoDb,
    deleteUserfromDb,
    suspendVendor,
    getUserFollowedShops,
};
