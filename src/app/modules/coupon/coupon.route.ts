import express from "express";
import { UserRole } from "../user/user.interface";
import Auth from "../../middlewares/Auth";
import { couponController } from "./coupon.controller";

const router = express.Router();

router.get("/", Auth(UserRole.Admin), couponController.getCoupons);

router.get(
  "/:couponId",
  Auth(UserRole.Customer, UserRole.Admin, UserRole.Vendor),
  couponController.getCouponById
);

router.get(
  "/validate-coupon/:couponId",
  Auth(UserRole.Customer, UserRole.Admin, UserRole.Vendor),
  couponController.validateCoupon
);

router.post(
  "/create-coupon",
  Auth(UserRole.Admin, UserRole.Vendor),
  couponController.createCoupon
);

router.patch(
  "/update-coupon/:couponId",
  Auth(UserRole.Admin, UserRole.Vendor),
  couponController.updateCoupon
);

router.delete(
  "/delete-coupon/:couponId",
  Auth(UserRole.Admin, UserRole.Vendor),
  couponController.deleteCoupon
);

export const CouponRoute = router;
