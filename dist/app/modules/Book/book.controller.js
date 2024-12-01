"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const book_service_1 = require("./book.service");
// Create a new book
const createBook = (0, catchAsync_1.default)(async (req, res) => {
    const bookData = req.body; // Get the book data from the request body
    // Call the service to create the book in the database
    const result = await book_service_1.bookService.createBikeIntoDB(bookData);
    // Send response with success
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED, // Use CREATED (201) status code for successful creation
        success: true,
        message: "Book created successfully",
        data: result,
    });
});
const RetrievesBook = (0, catchAsync_1.default)(async (req, res) => {
    const result = await book_service_1.bookService.RetrievesBookFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Books retrieved successfully",
        data: result,
    });
});
const fetchSingleBookById = (0, catchAsync_1.default)(async (req, res) => {
    const { bookId } = req.params;
    const result = await book_service_1.bookService.fetchSingleBookByIdFromDB(bookId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Book retrieved successfully",
        data: result,
    });
});
const BookUpdatesById = (0, catchAsync_1.default)(async (req, res) => {
    const { bookId } = req.params;
    const bookData = req.body;
    const result = await book_service_1.bookService.BookUpdatesByIdFromDB(bookId, bookData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Book updated successfully",
        data: result,
    });
});
const BookDeletesById = (0, catchAsync_1.default)(async (req, res) => {
    const { bookId } = req.params;
    const result = await book_service_1.bookService.BookDeletesByIdFromDB(bookId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Book deleted successfully",
    });
});
exports.bookController = {
    createBook,
    RetrievesBook,
    fetchSingleBookById,
    BookUpdatesById,
    BookDeletesById,
};
