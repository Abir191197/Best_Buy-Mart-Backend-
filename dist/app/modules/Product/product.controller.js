"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
const productCreate = (0, catchAsync_1.default)(async (req, res) => {
    // Parse product data (name, description, price, etc.) from the request body
    const productData = (req.body.data);
    // Collect all uploaded image paths and sizes from `req.files`
    const images = Array.isArray(req.files)
        ? req.files.map((file) => ({
            path: `/uploads/${file.filename}`, // Save image path
            size: file.size, // Save image size
        }))
        : []; // No images if none uploaded
    // Add images data to the product data
    const productWithImages = Object.assign(Object.assign({}, productData), { images });
    // Create the product in the database
    const result = await product_service_1.ProductService.createProductIntoDB(productWithImages);
    // Send response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product created successfully",
        data: result, // Return the created product data with images
    });
});
exports.productController = {
    productCreate,
};
