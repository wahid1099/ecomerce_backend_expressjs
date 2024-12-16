"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.post("/create-payment", payment_controller_1.PaymentControllers.createPayment);
router.post("/confirmation", payment_controller_1.PaymentControllers.confirmationController);
router.get("/get-all", payment_controller_1.PaymentControllers.getAllPayment);
router.get("/get-single/:id", payment_controller_1.PaymentControllers.getSinglePayment);
exports.PaymentRoute = router;
