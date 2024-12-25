"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_interface_1 = require("../user/user.interface");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
router.get("/", (0, Auth_1.default)(user_interface_1.UserRole.Admin), coupon_controller_1.couponController.getCoupons);
router.get("/:couponId", (0, Auth_1.default)(user_interface_1.UserRole.Customer, user_interface_1.UserRole.Admin, user_interface_1.UserRole.Vendor), coupon_controller_1.couponController.getCouponById);
router.post("/create-coupon", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Vendor), coupon_controller_1.couponController.createCoupon);
router.patch("/update-coupon/:couponId", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Vendor), coupon_controller_1.couponController.updateCoupon);
router.delete("/delete-coupon/:couponId", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Vendor), coupon_controller_1.couponController.deleteCoupon);
exports.CouponRoute = router;
