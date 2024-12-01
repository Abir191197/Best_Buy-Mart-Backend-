import express from "express";
import validateRequest from "../../middlewares/validRequestZod";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
const router = express.Router();

// Sign up route
router.post(
  "/signup",
  validateRequest(AuthValidation.signUpValidationSchema),
  AuthControllers.signUp
);
router.post("/OtpVerify", AuthControllers.OtpVerification);

router.post("/resendOtp", AuthControllers.resendCode);

// Log in route
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.logIn
);

// Refresh token route
router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshAccessToken
);


export const AuthRoutes = router;