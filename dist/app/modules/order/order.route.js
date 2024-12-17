"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// Route to create a new order
router.post("/createorder", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), order_controller_1.orderController.createOrder);
// Route to get orders for a specific user
router.get("/user-order", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), order_controller_1.orderController.getOrdersForUser);
// Route to get orders for a specific vendor (shop)
router.get("/orders/vendor/:shopId", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Vendor), order_controller_1.orderController.getOrdersForVendor);
// Route to update order status
router.put("/orders/status", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Vendor), order_controller_1.orderController.updateOrderStatus);
exports.OrderRoutes = router;
