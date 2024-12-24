import mongoose, { Schema, Document } from "mongoose";
import { IReview } from "./review.interface"; // Import the IReview interface

// Define the Review schema
const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    image: { type: String }, // Optional image
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Register the model with Mongoose
export const Review = mongoose.model<IReview>("Review", ReviewSchema);
