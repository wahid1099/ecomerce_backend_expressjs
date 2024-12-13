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
exports.ProductService = void 0;
const ApiErros_1 = __importDefault(require("../../errors/ApiErros"));
const product_model_1 = require("./product.model"); // Importing the Product model
const http_status_1 = __importDefault(require("http-status"));
// Create a new product
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.create(payload);
    if (!product) {
        throw new ApiErros_1.default(http_status_1.default.BAD_REQUEST, "Failed to create product");
    }
    return product;
});
// Update product details
const updateProduct = (productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(productId, payload, {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
    });
    if (!updatedProduct) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Product not found to update");
    }
    return updatedProduct;
});
// Delete a product
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId);
    if (!product) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    yield product_model_1.Product.deleteOne({ _id: productId });
    return { message: "Product deleted successfully!" };
});
// Get all products for a vendor (assumed `vendorId` corresponds to `shopId`)
const getVendorProducts = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find({ shopId: vendorId }).populate([
        "images",
        "reviews",
        "orderItems",
    ]); // Populate related fields if needed
    if (!products || products.length === 0) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "No products found for this vendor");
    }
    return products;
});
// Get product details by ID
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId)
        .populate("images reviews orderItems") // Populate related fields
        .orFail(); // Throws an error if not found
    return product;
});
// Remove image from the product
const removeImageFromProduct = (productId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findByIdAndUpdate(productId, { $pull: { images: imageUrl } }, // Remove the specific image
    { new: true, runValidators: true } // Return the updated product
    );
    if (!product) {
        throw new ApiErros_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return product;
});
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find().populate([
        "images",
        "reviews",
        "orderItems",
    ]); // You can populate other fields if necessary
    return products;
});
exports.ProductService = {
    createProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    getProductById,
    removeImageFromProduct,
    getAllProducts,
};
