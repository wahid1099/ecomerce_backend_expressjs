import { Router } from "express";
import { orderController } from "./order.controller";
import Auth from "../../middlewares/Auth";
import validateRequest from "../../middlewares/validaterequest";
import { UserRole } from "../user/user.interface";
const router = Router();

// Route to create a new order
router.post(
  "/createorder",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  orderController.createOrder
);

// Route to get orders for a specific user
router.get(
  "/user-order",
  Auth(UserRole.Admin, UserRole.Customer, UserRole.Vendor),
  orderController.getOrdersForUser
);

// Route to get orders for a specific vendor (shop)
router.get(
  "/orders/vendor/:shopId",
  Auth(UserRole.Admin, UserRole.Vendor),
  orderController.getOrdersForVendor
);

// Route to update order status
router.put(
  "/orders/status",
  Auth(UserRole.Admin, UserRole.Vendor),
  orderController.updateOrderStatus
);

export const OrderRoutes = router;
