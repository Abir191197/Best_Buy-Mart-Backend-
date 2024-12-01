"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const borrow_service_1 = require("./borrow.service");
const createBorrow = (0, catchAsync_1.default)(async (req, res) => {
    const borrowData = req.body; // Get the book data from the request body
    // Call the service to create the book in the database
    const result = await borrow_service_1.borrowService.createBorrowIntoDB(borrowData);
    // Send response with success
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED, // Use CREATED (201) status code for successful creation
        success: true,
        message: "Book borrowed successfully",
        data: result,
    });
});
const overdueBorrowList = (0, catchAsync_1.default)(async (req, res) => {
    // Fetch overdue borrow list from the service
    const result = await borrow_service_1.borrowService.overdueBorrowListFromDB();
    // Check if there are any overdue books
    if (result.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "No overdue books",
            data: result, // Return empty array
        });
    }
    // Send response with overdue books
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Overdue borrow list fetched successfully",
        data: result,
    });
});
exports.borrowController = {
    createBorrow,
    overdueBorrowList,
};
