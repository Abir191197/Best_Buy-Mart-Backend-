import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import { StatusCodes } from "http-status-codes";

//products create

const productCreate = catchAsync(async (req: Request, res: Response) => {
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

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
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



export const productController = {
  productCreate,
  getAllProducts,
};
