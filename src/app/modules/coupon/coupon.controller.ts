import { couponService } from "./coupon.service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const createCoupon = catchAsync(async (req, res) => {
  const result = await couponService.createCoupon(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Coupon created successfully",
    data: result,
  });
});

const getCoupons = catchAsync(async (req, res) => {
  const result = await couponService.getCoupons();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupons fetched successfully",
    data: result,
  });
});

const getCouponById = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const result = await couponService.getCouponById(couponId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Coupon with ID ${couponId} retrieved successfully.`,
    data: result,
  });
});
const updateCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const result = await couponService.updateCoupon(couponId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const result = await couponService.deleteCoupon(couponId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon deleted successfully",
    data: result,
  });
});

const validateCoupon = catchAsync(async (req, res) => {
  const { code } = req.params;
  const result = await couponService.validateCoupon(code);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon validated successfully",
    data: result,
  });
});
export const couponController = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  validateCoupon,
};
