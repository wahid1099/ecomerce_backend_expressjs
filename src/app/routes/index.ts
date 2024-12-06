import { ShopRoutes } from "./../modules/shop/shop.route";
import { userRoutes } from "./../modules/user/user.route";
import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
