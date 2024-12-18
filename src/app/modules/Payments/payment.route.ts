import express from "express";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

router.post("/create-payment", PaymentControllers.createPayment);

router.post("/confirmation", PaymentControllers.confirmationController);

router.get("/get-all", PaymentControllers.getAllPayment);

router.get("/get-single/:id", PaymentControllers.getSinglePayment);

export const PaymentRoute = router;
