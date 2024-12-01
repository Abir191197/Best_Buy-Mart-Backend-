import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.route";

import { productRoutes } from "../modules/Product/product.route";


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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
