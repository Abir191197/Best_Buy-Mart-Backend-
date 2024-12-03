"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_service_1 = require("./product.service");
const productCreate = async (req, res) => {
    try {
        const { data } = req.body; // Extract product data from the request body
        const images = req.files; // Get the uploaded images
        // Construct the productData object, including S3 image URLs
        const productData = Object.assign(Object.assign({}, data), { images: images.map((file) => ({
                path: file.location, // S3 URL of the uploaded image
                size: file.size, // Image size
            })) });
        // Save product data into the database
        const createdProduct = await product_service_1.ProductService.createProductIntoDB(productData);
        res.status(201).json({
            message: "Product created successfully",
            product: createdProduct,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
    }
};
exports.productController = {
    productCreate,
};
