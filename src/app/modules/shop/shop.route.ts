import express from "express";
import { ShopController } from "./shop.controller";
import Auth from "../../middlewares/Auth";
import { UserRole } from "../../modules/user/user.interface";
import validateRequest from "../../middlewares/validaterequest";
import { ShopValidationSchema } from "./shop.validation";

const router = express.Router();

// Create a new shop
router.post(
  "/",
  Auth(UserRole.Vendor),
  validateRequest(ShopValidationSchema.createShopSchema),
  ShopController.createShop
);

// Get all shops for the vendor
router.get("/", Auth(UserRole.Admin), ShopController.getVendorShops);

// Shop-specific actions
// router.get(
//   "/:shopId/followers",
//   Auth(UserRole.Admin, UserRole.Vendor),
//   ShopController.getShopFollowers
// );

router.get(
  "/:shopId/orders",
  Auth(UserRole.Vendor),
  ShopController.getShopOrderHistory
);

// router.post(
//   "/:shopId/follow",
//   Auth(UserRole.Customer, UserRole.Vendor),
//   ShopController.followShop
// );

// router.post(
//   "/:shopId/unfollow",
//   Auth(UserRole.Customer, UserRole.Vendor),
//   ShopController.unfollowShop
// );

// Get a single shop
router.get("/:shopId", ShopController.getSingleShopData);

// Update shop details
router.patch(
  "/:shopId",
  Auth(UserRole.Vendor),
  validateRequest(ShopValidationSchema.updateShopSchema),
  ShopController.updateShop
);

// Delete a shop
router.delete("/:shopId", Auth(UserRole.Vendor), ShopController.deleteShop);

export const ShopRoutes = router;
