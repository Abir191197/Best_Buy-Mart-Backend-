import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// IPN Route
router.post("/ipn", PaymentController.validatePayment);

router.post("/success", PaymentController.paymentSuccess);

export const paymentRoute = router;
