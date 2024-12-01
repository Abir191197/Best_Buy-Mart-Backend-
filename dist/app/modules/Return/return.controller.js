"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const return_service_1 = require("./return.service");
const returnBook = (0, catchAsync_1.default)(async (req, res) => {
    const borrowId = req.body; // Get the book data from the request body
    // Call the service to create the book in the database
    const result = await return_service_1.returnService.returnBookFromDB(borrowId);
    // Send response with success
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK, // Use CREATED (201) status code for successful creation
        success: true,
        message: "Book returned successfully",
    });
});
exports.returnController = {
    returnBook,
};
