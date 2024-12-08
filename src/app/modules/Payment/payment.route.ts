import express from "express";
import authVerify from "../../middlewares/authVerify";
import { USER_ROLE } from "../User/user.constant";
import { PaymentController } from "./payment.controller";

const router = express.Router();

//get order from user

router.get(
  "/ipn",
  
  PaymentController.validatePayment
);




export const paymentRoute = router;
