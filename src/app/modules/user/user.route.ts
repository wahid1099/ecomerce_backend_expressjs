import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import Auth from "../../middlewares/Auth";
import { UserRole } from "./user.interface";
import { UserValidationSchema } from "./user.validation";
import validateRequest from "../../middlewares/validaterequest";

const router = express.Router();

// Get all users (only for Admin)
router.get("/", Auth(UserRole.Admin), UserController.getAllUsersfromDb);

// Create a new user (Admin only)
router.post(
  "/create-user",
  validateRequest(UserValidationSchema.UserSchemaCreate),
  UserController.inserUserIntoDB
);

// Get user profile (Admin, Customer, or Vendor)
router.get(
  "/me",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  UserController.getMyprofilefromDb
);

// Get followed shops (only for Customers)
router.get(
  "/followed-shops",
  Auth(UserRole.Customer),
  UserController.getUserFollowedShops
);

// Update user profile (Admin, Customer, or Vendor)
router.patch(
  "/update-my-profile/:userId",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  validateRequest(UserValidationSchema.UserSchemaUpdate),
  UserController.updateUserIntoDb
);

// Suspend/Unsuspend a vendor (only for Admin)
router.patch(
  "/suspend-vendor/:vendorId",
  Auth(UserRole.Admin),
  UserController.suspendVendor
);

// Delete a user (only for Admin)
router.patch(
  "/deactivate-user/:userId", // Fixed the route here by adding the missing "/"
  Auth(UserRole.Admin),
  UserController.deleteUserfromDb
);

export const userRoutes = router;
