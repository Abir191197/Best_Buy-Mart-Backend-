import express from "express";
import authVerify from "../../middlewares/authVerify";
import { USER_ROLE } from "../User/user.constant";
import { orderController } from "./order.controller";
const router = express.Router();

//get order from user

router.post("/",
    authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR, USER_ROLE.USER),
    orderController.createOrder
)






export const orderRoutes = router;
