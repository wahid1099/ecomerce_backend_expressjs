import express from "express";
import { PaymentControllers } from "./payment.controller";
import { UserRole } from "../user/user.interface";
import Auth from "../../middlewares/Auth";

const router = express.Router();

router.post(
  "/create-payment",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  PaymentControllers.createPayment
);

router.post(
  "/confirmation",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  PaymentControllers.confirmationController
);

router.get(
  "/get-all-payments",
  Auth(UserRole.Admin),
  PaymentControllers.getAllPayment
);

router.get("/get-single/:id", PaymentControllers.getSinglePayment);

export const PaymentRoute = router;
