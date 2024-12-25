import express from "express";
import { UserController } from "./user.controller";
import Auth from "../../middlewares/Auth";
import { UserRole } from "./user.interface";
import { UserValidationSchema } from "./user.validation";
import validateRequest from "../../middlewares/validaterequest";

const router = express.Router();

// **Admin-Only Routes**
// Get all users
router.get("/", Auth(UserRole.Admin), UserController.getAllUsersfromDb);

// Create a new user
router.post(
  "/create-user",
  validateRequest(UserValidationSchema.UserSchemaCreate),
  UserController.inserUserIntoDB
);

// Suspend/Unsuspend a vendor
router.patch(
  "/suspend-vendor/:vendorId",
  Auth(UserRole.Admin),
  UserController.suspendVendor
);

// Delete a user
router.patch(
  "/deactivate-user/:userId",
  Auth(UserRole.Admin),
  UserController.deleteUserfromDb
);

// **Shared Routes (Admin, Customer, Vendor)**
// Get user profile
router.get(
  "/me",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  UserController.getMyprofilefromDb
);

// Update user profile
router.patch(
  "/update-my-profile/:userId",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  validateRequest(UserValidationSchema.UserSchemaUpdate),
  UserController.updateUserIntoDb
);

// **Customer & Vendor Routes**
// Toggle follow shop
router.post(
  "/toggle-followshop/:shopId", // Fixed typo in route: "fllowshop" -> "followshop"
  Auth(UserRole.Customer, UserRole.Vendor),
  UserController.toggleShopFollow
);

// **Customer-Only Routes**
// Get followed shops
router.get(
  "/followed-shops",
  Auth(UserRole.Customer),
  UserController.getUserFollowedShops
);

export const userRoutes = router;
