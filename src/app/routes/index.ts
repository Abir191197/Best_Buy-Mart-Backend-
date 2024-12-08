import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.route";

import { productRoutes } from "../modules/Product/product.route";
import path from "path";
import { shopRoutes } from "../modules/Shop/shop.route";
import { orderRoutes } from "../modules/Order/order.route";
import { paymentRoute } from "../modules/Payment/payment.route";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/product",
    route: productRoutes,
  },
  {
    path: "/shop",
    route: shopRoutes,
  },
  {
    path: "/order",
    route: orderRoutes,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

