"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const productImgUpload_1 = require("../../utils/productImgUpload"); // Multer middleware for image upload
const router = express_1.default.Router();
// POST route to create a product with images
router.post("/createProduct", productImgUpload_1.productImgUpload.upload.array("images", 5), // Allows up to 5 images to be uploaded
(req, res, next) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
}, product_controller_1.productController.productCreate // Call the controller's product creation function
);
// GET route to fetch all products
router.get("/getProducts", product_controller_1.productController.productGetAll);
exports.productRoutes = router;
