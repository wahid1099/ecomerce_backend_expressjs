import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { Review } from "./review.model";
import { Order } from "../order/order.model";
import { Product } from "../products/product.model";
import { User } from "../user/user.model";

const createReviewIntoDb = async (payload: any) => {
  const review = await Review.create(payload);

  const { product, user, order } = payload;

  // Update the product to include the review
  if (product) {
    await Product.findByIdAndUpdate(
      product,
      { $push: { reviews: review._id } }, // Push the review ID into the product's reviews array
      { new: true }
    );
  }

  // Update the user to include the review (if you have a reviews array in User)
  if (user) {
    await User.findByIdAndUpdate(
      user,
      { $push: { reviews: review._id } }, // Push the review ID into the user's reviews array
      { new: true }
    );
  }

  // Mark the order as reviewed
  if (order) {
    await Order.findByIdAndUpdate(
      order, // Corrected: It should update the `order`, not `user`
      { isReviewed: true }, // Update the isReviewed field to true
      { new: true }
    );
  }

  return review; // Return the created review
};

const getAllReviewsFromDb = async () => {
  const reviews = await Review.find().populate([
    "user",
    "shop",
    "order",
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
