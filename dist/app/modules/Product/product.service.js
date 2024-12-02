"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProductIntoDB = async (productData) => {
    try {
        // Create a new product, including associated images
        const product = await prisma.product.create({
            data: {
                name: productData.name,
                description: productData.description,
                price: productData.price,
                stock: productData.stock,
                isAvailable: productData.isAvailable,
                ProductImg: {
                    create: productData.images.map((img) => ({
                        imgPath: img.path, // Save the image path
                        imgSize: img.size, // Save the image size
                    })),
                },
            },
            include: {
                ProductImg: true, // Include the product images in the response
            },
        });
        console.log("Product created with images:", product);
        return product; // Return the created product with images
    }
    catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};
const getAllProductsFromDB = async () => {
    try {
        // Fetch all products, including associated images
        const products = await prisma.product.findMany({
            include: {
                ProductImg: true, // Include the product images in the response
            },
        });
        console.log("Products fetched:", products);
        return products; // Return all products with images
    }
    catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};
exports.ProductService = {
    createProductIntoDB,
    getAllProductsFromDB,
};
