"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validRequestZod_1 = __importDefault(require("../../middlewares/validRequestZod"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
// Sign up route
router.post("/signup", (0, validRequestZod_1.default)(auth_validation_1.AuthValidation.signUpValidationSchema), auth_controller_1.AuthControllers.signUp);
router.post("/OtpVerify", auth_controller_1.AuthControllers.OtpVerification);
router.post("/resendOtp", auth_controller_1.AuthControllers.resendCode);
// Log in route
router.post("/login", (0, validRequestZod_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.logIn);
// Refresh token route
router.post("/refresh-token", (0, validRequestZod_1.default)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshAccessToken);
exports.AuthRoutes = router;
