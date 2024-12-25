import Coupon from "./coupon.model";
import ApiError from "../../errors/ApiError";
import { ICoupon } from "./coupon.interface";
import httpStatus from "http-status";
const createCoupon = async (payload: any) => {
  if (new Date(payload.validFrom) >= new Date(payload.validUntil)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "validFrom must be earlier than validUntil"
    );
  }
  const coupon = await Coupon.create(payload);
  return coupon;
};

const getCoupons = async () => {
  const coupons = await Coupon.find();
  return coupons;
};

const getCouponById = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found");
  }
  return coupon;
};

const updateCoupon = async (couponId: string, payload: Partial<ICoupon>) => {
  // Validate updated payload
  if (
    payload.validFrom &&
    payload.validUntil &&
    new Date(payload.validFrom) >= new Date(payload.validUntil)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "validFrom must be earlier than validUntil"
    );
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedCoupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found to update");
  }
  return updatedCoupon;
};

const deleteCoupon = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found");
  }
  await Coupon.deleteOne({ _id: couponId });
  return coupon;
};

const validateCoupon = async (code: string) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid coupon code");
  }
  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coupon code is not valid");
  }
  return coupon;
};

export const couponService = {
  createCoupon,
  getCoupons,
  getCouponById,
  deleteCoupon,
  updateCoupon,
  validateCoupon,
};
