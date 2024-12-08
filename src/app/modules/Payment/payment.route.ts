import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// IPN Route
router.get("/ipn", PaymentController.validatePayment);

export const paymentRoute = router;
