import { ShopRoutes } from "./../modules/shop/shop.route";
import { userRoutes } from "./../modules/user/user.route";
import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { ProductRoutes } from "../modules/products/prdocut.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
