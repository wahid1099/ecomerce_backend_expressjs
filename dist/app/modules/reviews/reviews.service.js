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
const createReviewIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.create(payload);
    const { product, user } = payload;
    if (product) {
        yield product.findByIdAndUpdate(product, { $push: { reviews: review._id } }, { new: true });
    }
    if (user) {
        yield product.findByIdAndUpdate(user, { $push: { reviews: review._id } }, { new: true });
    }
    return review;
});
const getAllReviewsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.Review.find().populate([
        "user",
        "shop",
        "oder",
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
