"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
// Controller to handle retrieving a user profile
const findUser = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.user) {
        // Handle case where req.user is undefined
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null,
        });
    }
    try {
        const result = await user_service_1.UserService.findUserFromDB(req.user);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "User profile retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to retrieve user profile",
            data: null,
        });
    }
});
// Controller to handle updating a user profile
const updatedUser = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.user) {
        // Handle case where req.user is undefined
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null,
        });
    }
    try {
        const result = await user_service_1.UserService.updatedUserIntoDB(req.user, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Profile updated successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Failed to update profile",
            data: null,
        });
    }
});
exports.userControllers = {
    findUser,
    updatedUser,
};
