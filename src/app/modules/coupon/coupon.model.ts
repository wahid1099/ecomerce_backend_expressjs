import { Schema, model } from "mongoose";
import { ICoupon } from "./coupon.interface";

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },

    discount: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: false }, // Optional shop association
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Coupon = model<ICoupon>("Coupon", couponSchema);
export default Coupon;
