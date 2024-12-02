import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";

const productCreate = catchAsync(async (req, res) => {
  // Parse product data (name, description, price, etc.) from the request body
  const productData = (req.body.data);

  // Collect all uploaded image paths and sizes from `req.files`
  const images = Array.isArray(req.files)
    ? req.files.map((file: any) => ({
        path: `/uploads/${file.filename}`, // Save image path
        size: file.size, // Save image size
      }))
    : []; // No images if none uploaded

  // Add images data to the product data
  const productWithImages = {
    ...productData,
    images, // Add the image data to the product
  };

  // Create the product in the database
  const result = await ProductService.createProductIntoDB(productWithImages);

  // Send response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product created successfully",
    data: result, // Return the created product data with images
  });
});


const productGetAll = catchAsync(async (req, res) => {
  // Fetch all products from the database
  const products = await ProductService.getAllProductsFromDB();

  // Send response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products fetched successfully",
    data: products, // Return all products
  });
});


export const productController = {
  productCreate,
  productGetAll,
};
