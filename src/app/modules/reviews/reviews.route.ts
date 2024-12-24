import express from "express";
import { UserRole } from "../user/user.interface";
import Auth from "../../middlewares/Auth";
import { ReivewController } from "./reivews.controller";

const router = express.Router();

router.post(
  "/create-review",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  ReivewController.createProductController
);

router.get("/", Auth(UserRole.Admin), ReivewController.getAllReviews);

export const PaymentRoute = router;
