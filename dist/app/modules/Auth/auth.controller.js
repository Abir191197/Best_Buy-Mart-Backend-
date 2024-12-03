"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../Error/appError"));
// Helper function to set authentication cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
    });
    res.cookie("accessToken", accessToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
    });
};
// SignIn function
const signUp = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthServices.signUpUser(req.body);
    const { email } = result;
    // Set HttpOnly and Secure cookies for refreshToken and accessToken
    // Filter user data to exclude sensitive information
    const userData = {
        email: email,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User Sign Up successfully",
        data: userData,
    });
});
// LogIn function
const logIn = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthServices.logInUser(req.body);
    const { user, accessToken, refreshToken } = result;
    // Set HttpOnly and Secure cookies for refreshToken and accessToken
    setAuthCookies(res, accessToken, refreshToken);
    // Filter user data to exclude sensitive information
    const userData = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        //address: result.user.address,
        role: user.role,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User logged in successfully",
        token: accessToken,
        data: userData,
    });
});
// RefreshToken function
const refreshAccessToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Refresh token not provided");
    }
    const result = await auth_service_1.AuthServices.refreshToken(refreshToken);
    // Set new access token in cookie
    res.cookie("accessToken", result.accessToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Access token refreshed successfully!",
        token: result.accessToken,
        data: null,
    });
});
//verify OTP and sign up complete
const OtpVerification = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthServices.OtpVerifyFromDB(req.body);
    const { user, accessToken, refreshToken } = result;
    // Set HttpOnly and Secure cookies for refreshToken and accessToken
    setAuthCookies(res, accessToken, refreshToken);
    // Filter user data to exclude sensitive information
    const userData = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        //address: result.user.address,
        role: user.role,
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User verify  successfully",
        token: accessToken,
        data: userData,
    });
});
const resendCode = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthServices.resendOtpIntoDB(req.body);
    const { message } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "OTP sent successfully",
        data: { message },
    });
});
exports.AuthControllers = {
    signUp,
    logIn,
    refreshAccessToken,
    //google,
    OtpVerification,
    resendCode,
};
