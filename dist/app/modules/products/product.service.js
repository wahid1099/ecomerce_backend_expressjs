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
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const product_model_1 = require("./product.model"); // Importing the Product model
const http_status_1 = __importDefault(require("http-status"));
// Create a new product
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.create(payload);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create product");
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
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found to update");
    }
    return updatedProduct;
});
// Delete a product
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    yield product_model_1.Product.deleteOne({ _id: productId });
    return { message: "Product deleted successfully!" };
});
// Get all products for a vendor (assumed `vendorId` corresponds to `shopId`)
const getVendorProducts = (shopID) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find({ shop: shopID }).populate([
        "images",
        // "reviews",
        "orderItems",
    ]); // Populate related fields if needed
    return products;
});
// Get product details by ID
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId).populate("shop");
    return product;
});
// Remove image from the product
const removeImageFromProduct = (productId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findByIdAndUpdate(productId, { $pull: { images: imageUrl } }, // Remove the specific image
    { new: true, runValidators: true } // Return the updated product
    );
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    return product;
});
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find().populate(["images", "orderItems"]); // You can populate other fields if necessary
    return products;
});
const getPaginatedProducts = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, limit, sortBy, sortOrder } = paginationOptions;
    const query = {};
    // Example: Apply filters
    if (filters.category) {
        query.category = filters.category;
    }
    if (filters.name) {
        query.name = { $regex: filters.name, $options: "i" }; // Case-insensitive search
    }
    // **3. Filter by price range**
    if (filters.minPrice || filters.maxPrice) {
        query.price = Object.assign(Object.assign({}, (filters.minPrice ? { $gte: Number(filters.minPrice) } : {})), (filters.maxPrice ? { $lte: Number(filters.maxPrice) } : {}));
    }
    const data = yield product_model_1.Product.find(query)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const totalItems = yield product_model_1.Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return {
        data,
        totalItems,
        totalPages,
    };
});
exports.ProductService = {
    createProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    getProductById,
    removeImageFromProduct,
    getAllProducts,
    getPaginatedProducts,
};
