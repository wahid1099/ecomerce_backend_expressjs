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
const product_model_1 = require("./product.model"); // Importing the Product model
const product_model_2 = require("./product.model"); // Importing ProductImage if needed for image management
const mongoose_1 = __importDefault(require("mongoose"));
// Create a new product
const createProductWithImages = (productPayload, imagePayloads) => __awaiter(void 0, void 0, void 0, function* () {
    // Start a transaction to ensure atomicity
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Step 1: Create the product
        const product = yield product_model_1.Product.create([productPayload], { session });
        // Step 2: Add product images
        const productImages = imagePayloads.map((image) => (Object.assign(Object.assign({}, image), { productId: product[0]._id })));
        const images = yield product_model_2.ProductImage.insertMany(productImages, { session });
        // Step 3: Update the product with the associated images
        product[0].images = images.map((img) => img._id);
        yield product[0].save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return { product: product[0], images };
    }
    catch (error) {
        // Rollback the transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Update product details
const updateProduct = (productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(productId, payload, {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
    });
    return updatedProduct;
});
// Delete a product
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield product_model_1.Product.findByIdAndDelete(productId);
    return { message: "Product deleted successfully!" };
});
// Get all products for a vendor (assumed `vendorId` corresponds to `shopId`)
const getVendorProducts = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find({ shopId: vendorId }).populate([
        "images",
        "reviews",
        "orderItems",
    ]); // Populate related fields if needed
    return products;
});
// Get product details by ID
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId)
        .populate("images reviews orderItems") // Populate related fields
        .orFail(); // Throws an error if not found
    return product;
});
exports.ProductService = {
    createProductWithImages,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    getProductById,
};
