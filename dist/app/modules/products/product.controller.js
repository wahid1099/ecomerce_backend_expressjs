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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const product_service_1 = require("./product.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createProductController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield product_service_1.ProductService.createProduct(Object.assign(Object.assign({}, req.body), { vendorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Product created successfully!",
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const _b = req.body, { imagesToRemove } = _b, updateData = __rest(_b, ["imagesToRemove"]); // Destructure to get imagesToRemove and the rest of the data
    // Remove images if specified
    if (imagesToRemove && Array.isArray(imagesToRemove)) {
        for (const imageUrl of imagesToRemove) {
            yield product_service_1.ProductService.removeImageFromProduct(productId, imageUrl); // Call your service to remove the image
        }
    }
    // Update the product with the rest of the data
    const updatedProduct = yield product_service_1.ProductService.updateProduct(productId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Product updated successfully!",
        data: updatedProduct,
    });
}));
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield product_service_1.ProductService.deleteProduct(productId);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found for deletion");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
const getVendorProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const result = yield product_service_1.ProductService.getVendorProducts((_c = req.user) === null || _c === void 0 ? void 0 : _c.shop);
    const message = result && result.length > 0
        ? "Products fetched successfully!"
        : "No products found for this vendor";
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: message,
        data: result || [],
    });
}));
const getProductById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield product_service_1.ProductService.getProductById(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Product fetched successfully!",
        data: result,
    });
}));
const getAllProductsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductService.getAllProducts();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All products fetched successfully for Admin!",
        data: result,
    });
}));
const browseProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.query;
    const paginationOptions = paginationHelper_1.paginationHelper.calculatePagination(req.query);
    const { data, totalItems, totalPages } = yield product_service_1.ProductService.getPaginatedProducts(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All products fetched successfully for user!",
        data: data,
        pagination: {
            totalItems,
            totalPages,
            currentPage: paginationOptions.page,
            pageSize: paginationOptions.limit,
        },
    });
}));
exports.ProductController = {
    getProductById,
    getVendorProducts,
    deleteProduct,
    updateProduct,
    createProductController,
    getAllProductsForAdmin,
    browseProducts,
};
