"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shop_route_1 = require("./../modules/shop/shop.route");
const user_route_1 = require("./../modules/user/user.route");
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const prdocut_route_1 = require("../modules/products/prdocut.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/shop",
        route: shop_route_1.ShopRoutes,
    },
    {
        path: "/product",
        route: prdocut_route_1.ProductRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
