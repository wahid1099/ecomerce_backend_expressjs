"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const user_interface_1 = require("../user/user.interface");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const router = express_1.default.Router();
router.post("/create-payment", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), payment_controller_1.PaymentControllers.createPayment);
router.post("/confirmation", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), payment_controller_1.PaymentControllers.confirmationController);
router.get("/get-all", (0, Auth_1.default)(user_interface_1.UserRole.Admin), payment_controller_1.PaymentControllers.getAllPayment);
router.get("/get-single/:id", payment_controller_1.PaymentControllers.getSinglePayment);
exports.PaymentRoute = router;
