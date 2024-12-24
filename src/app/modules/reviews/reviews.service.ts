import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { Review } from "./review.model";

const createReviewIntoDb = async (payload: any) => {
  const review = await Review.create(payload);

  const { product, user } = payload;
  if (product) {
    await product.findByIdAndUpdate(
      product,
      { $push: { reviews: review._id } },
      { new: true }
    );
  }
  if (user) {
    await product.findByIdAndUpdate(
      user,
      { $push: { reviews: review._id } },
      { new: true }
    );
  }

  return review;
};

const getAllReviewsFromDb = async () => {
  const reviews = await Review.find().populate([
    "user",
    "shop",
    "oder",
    "product",
  ]);
  if (!reviews.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Reviews Found!");
  }
  return reviews;
};

export const ReviewService = {
  createReviewIntoDb,
  getAllReviewsFromDb,
};
