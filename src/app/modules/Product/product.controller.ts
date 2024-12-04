import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import { StatusCodes } from "http-status-codes";

//products create

const productCreate = catchAsync(async (req, res) => {
  try {
    const { data } = req.body; // Extract product data from the request body

    // Define the CustomFile interface for files uploaded with Multer
    interface CustomFile extends Express.Multer.File {
      location: string;
    }

    // Get the uploaded images
    const images = req.files as CustomFile[];

    // Construct the productData object, including S3 image URLs
    const productData = {
      ...data,
      images: images.map((file) => ({
        path: file.location, // S3 URL of the uploaded image
        size: file.size, // Image size
      })),
    };

    // Save product data into the database
    const createdProduct = await ProductService.createProductIntoDB(
      productData
    );

    // Send the response with the created product
    sendResponse(res, {
      statusCode: StatusCodes.CREATED, // 201 status for created resources
      success: true,
      message: "Product created successfully", // Success message
      data: createdProduct, // Send the created product as the response
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating product", // Return an error message
    });
  }
});


// get all products and search and limit and pagination

const getAllProducts = catchAsync(async (req, res) => {
  try {
    // Parse query parameters from the request
    const query = {
      searchTerm: req.query.searchTerm as string | undefined, // Extract searchTerm if provided
      sort: req.query.sort ? JSON.parse(req.query.sort as string) : undefined, // Parse sorting query
      skip: req.query.skip ? Number(req.query.skip) : undefined, // Pagination: skip value
      limit: req.query.limit ? Number(req.query.limit) : undefined, // Pagination: limit value
      fields:
        typeof req.query.fields === "string"
          ? req.query.fields.split(",").reduce((acc, field) => {
              acc[field] = true;
              return acc;
            }, {} as Record<string, boolean>)
          : undefined, // Field selection
    };

    console.log(query); // Optional: log the parsed query for debugging

    // Fetch products from the service
    const products = await ProductService.getAllProductsFromDB(query);

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 OK status
      success: true,
      message: "Products retrieved successfully", // Success message
      data: products, // Data containing the retrieved products
    });
  } catch (error) {
    console.error("Error getting products:", error);
    // Send error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to retrieve products", // Error message
    });
  }
});

const productUpdate = catchAsync(async (req, res) => {
  try {
    const { data } = req.body; // Extract product data from the request body
    const productId = req.params.productId; // Get the productId from the URL params

    // Define the CustomFile interface for files uploaded with Multer
    interface CustomFile extends Express.Multer.File {
      location: string;
    }

    // Get the uploaded images (if any)
    const images = req.files as CustomFile[];

    // Prepare product data for update
    const updateData: any = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      isAvailable: data.isAvailable,
      category: data.category,
    };

    // If new images were uploaded, process them and update the product images
    if (images && images.length > 0) {
      updateData.ProductImg = {
        create: images.map((file) => ({
          imgPath: file.location, // Save the image URL from S3
          imgSize: file.size, // Save the image size
        })),
      };
    }

    // Update the product in the database
    const updatedProduct = await ProductService.updateProductInDB(
      productId,
      updateData
    );

    // Send the response with the updated product
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 status for successful update
      success: true,
      message: "Product updated successfully", // Success message
      data: updatedProduct, // Send the updated product as the response
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error updating product", // Return an error message
    });
  }
});




export const productController = {
  productCreate,
  getAllProducts,
  productUpdate,
};
