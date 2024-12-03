import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.route";

import { productRoutes } from "../modules/Product/product.route";
import path from "path";
import { shopRoutes } from "../modules/Shop/shop.route";


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
    route:shopRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
