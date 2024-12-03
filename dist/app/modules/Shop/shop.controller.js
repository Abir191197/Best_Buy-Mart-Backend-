"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopController = void 0;
const http_status_codes_1 = require("http-status-codes"); // Importing HTTP status codes
const shop_service_1 = require("./shop.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// Assuming the response utility is here
const shopCreate = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { data } = req.body; // Extract shop data from the request body
        const images = req.files; // Get the uploaded images with S3 location
        // Construct the shopData object, including S3 image URLs
        const shopData = Object.assign(Object.assign({}, data), { images: images.map((file) => ({
                path: file.location, // S3 URL of the uploaded image
                size: file.size, // Image size
            })) });
        // Save shop data into the database
        const result = await shop_service_1.ShopService.createShopIntoDB(shopData);
        // Return the response using the sendResponse utility
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED, // 201 status for created resources
            success: true,
            message: "Shop created successfully", // Correct success message
            data: result,
        });
    }
    catch (error) {
        console.error("Error creating shop:", error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error creating shop" });
    }
});
//ONLY FOR ADMIN TO GET ALL SHOP
const getAllShop = (0, catchAsync_1.default)(async (req, res) => {
    try {
        // Call the service method to get all shops from the database
        const result = await shop_service_1.ShopService.getAllShopFromDB();
        // Send a response with the result (shops)
        (0, sendResponse_1.default)(res, {
            statusCode: 200, // 200 OK
            success: true,
            message: "Shops retrieved successfully", // Success message
            data: result, // Return the retrieved shops
        });
    }
    catch (error) {
        console.error("Error getting all shops:", error);
        res.status(500).json({ message: "Error getting all shops" }); // Return an error response
    }
});
const getMyAllShopForVendor = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { UserId } = req.params; // Extract the user ID from the request parameters
        // Call the service method to get all shops for the user
        const result = await shop_service_1.ShopService.getMyShopFromDB(UserId);
        // Send a response with the result (shops)
        (0, sendResponse_1.default)(res, {
            statusCode: 200, // 200 OK
            success: true,
            message: "Shops retrieved successfully", // Success message
            data: result, // Return the retrieved shops
        });
    }
    catch (error) {
        console.error("Error getting all shops:", error);
        res.status(500).json({ message: "Error getting all shops" }); // Return an error response
    }
});
const approveShopByAdmin = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { ShopId } = req.params;
        const { statusAction } = req.body; // Extract the shop ID from the request parameters
        console.log(ShopId, statusAction);
        // Call the service method to approve the shop by ID
        const result = await shop_service_1.ShopService.approveShopByIdIntoDB(ShopId, statusAction);
        // Send a response with the result (approved shop)
        (0, sendResponse_1.default)(res, {
            statusCode: 200, // 200 OK
            success: true,
            message: "Shop approved successfully", // Success message
            data: result, // Return the approved shop
        });
    }
    catch (error) {
        console.error("Error approving shop:", error);
        res.status(500).json({ message: "Error approving shop" }); // Return an error response
    }
});
const shopUpdate = (0, catchAsync_1.default)(async (req, res) => {
    try {
        const { ShopId } = req.params; // Get the ShopId from the request parameters
        const { data } = req.body; // Extract the updated shop data from the request body
        console.log("data from shop", data);
        const images = req.files;
        // Construct the updated shopData object, including S3 image URLs
        const shopData = Object.assign(Object.assign({}, data), { images: images === null || images === void 0 ? void 0 : images.map((file) => ({
                path: file.location, // S3 URL of the uploaded image
                size: file.size, // Image size
            })) });
        // Update the shop data in the database using the ShopService
        const updatedShop = await shop_service_1.ShopService.updateShopInDB(ShopId, shopData);
        // Return the response using the sendResponse utility
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK, // 200 status for successful update
            success: true,
            message: "Shop updated successfully", // Success message
            data: updatedShop, // Return the updated shop data
        });
    }
    catch (error) {
        console.error("Error updating shop:", error);
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error updating shop" });
    }
});
exports.shopController = {
    shopCreate,
    getAllShop,
    getMyAllShopForVendor,
    approveShopByAdmin,
    shopUpdate,
};
