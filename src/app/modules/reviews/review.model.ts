import mongoose, { Schema, Document } from "mongoose";
import { IReview } from "./review.interface"; // Import the IReview interface

// Define the Review schema
const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Register the model with Mongoose
const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
