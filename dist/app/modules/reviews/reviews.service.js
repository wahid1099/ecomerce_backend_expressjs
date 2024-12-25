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
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const review_model_1 = require("./review.model");
const order_model_1 = require("../order/order.model");
const product_model_1 = require("../products/product.model");
const user_model_1 = require("../user/user.model");
const createReviewIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.create(payload);
    const { product, user, order } = payload;
    // Update the product to include the review
    if (product) {
        yield product_model_1.Product.findByIdAndUpdate(product, { $push: { reviews: review._id } }, // Push the review ID into the product's reviews array
        { new: true });
    }
    // Update the user to include the review (if you have a reviews array in User)
    if (user) {
        yield user_model_1.User.findByIdAndUpdate(user, { $push: { reviews: review._id } }, // Push the review ID into the user's reviews array
        { new: true });
    }
    // Mark the order as reviewed
    if (order) {
        yield order_model_1.Order.findByIdAndUpdate(order, // Corrected: It should update the `order`, not `user`
        { isReviewed: true }, // Update the isReviewed field to true
        { new: true });
    }
    return review; // Return the created review
});
const getAllReviewsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find().populate([
        "user",
        "shop",
        "order",
        "product",
    ]);
    if (!reviews.length) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Reviews Found!");
    }
    return reviews;
});
exports.ReviewService = {
    createReviewIntoDb,
    getAllReviewsFromDb,
};
