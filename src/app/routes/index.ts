import { ShopRoutes } from "./../modules/shop/shop.route";
import { userRoutes } from "./../modules/user/user.route";
import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { ProductRoutes } from "../modules/products/prdocut.route";
import { OrderRoutes } from "../modules/order/order.route";
// import { PaymentRoute } from "../modules/payment/payment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/shop",
    route: ShopRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  // {
  //   path: "/payment",
  //   route: PaymentRoute,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
