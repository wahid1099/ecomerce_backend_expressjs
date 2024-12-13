import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import Auth from "../../middlewares/Auth";
import { UserRole } from "./user.interface";
// import { fileUploader } from "../../../helpars/fileUploader";
import { UserValidationSchema } from "./user.validation";
import validateRequest from "../../middlewares/validaterequest";

const router = express.Router();
router.get("/", Auth(UserRole.Admin), UserController.getAllUsersfromDb);

router.post(
  "/create-user",

  validateRequest(UserValidationSchema.UserSchemaCreate),
  UserController.inserUserIntoDB
);

router.get(
  "/me",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  UserController.getMyprofilefromDb
);

router.get(
  "/followed-shops",
  Auth(UserRole.Customer),
  UserController.getUserFollowedShops
);
router.patch(
  "/update-my-profile/:userId",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  validateRequest(UserValidationSchema.UserSchemaUpdate),
  UserController.updateUserIntoDb
);

router.patch(
  "/suspend-vendor/:vendorId",
  Auth(UserRole.Admin), // Only Admins can suspend vendors
  UserController.suspendVendor
);

router.delete(
  "delete-user/:userId",
  Auth(UserRole.Admin),
  UserController.deleteUserfromDb
);

export const userRoutes = router;
