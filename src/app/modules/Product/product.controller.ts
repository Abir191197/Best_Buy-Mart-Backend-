import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import { JwtPayload } from "jsonwebtoken";

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
      message: "Error creating product: " + (error as Error).message, // Return an error message
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

//get  single product
const getProduct = catchAsync(async (req, res) => {
  try {
    const productId = req.params.productId; // Extract the productId from the URL params

    // Fetch the product from the database
    const product = await ProductService.getProductFromDB(productId);

    // Send the response with the retrieved product
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 status for successful request
      success: true,
      message: "Product retrieved successfully", // Success message
      data: product, // Send the product data as the response
    });
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error getting product", // Return an error message
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

const productDuplicate = catchAsync(async (req, res) => {
  try {
    const { data } = req.body;
    const { productId } = req.params;
    

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
    const createdProduct = await ProductService.duplicateProductInDB(
      productId,
      productData
      
    );

    // Send the response with the created product
    sendResponse(res, {
      statusCode: StatusCodes.CREATED, // 201 status for created resources
      success: true,
      message: "Duplicate existing product created successfully", // Success message
      data: createdProduct, // Send the created product as the response
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error creating product", // Return an error message
    });
  }
});

// Track product view

const trackProductView = catchAsync(async (req, res) => {

  try {
     const userId = req.user as JwtPayload;
    const { productId } = req.params; // Extract the productId from the request body

    // Track the product view
    await ProductService.trackProductViewInDB(userId, productId);

    // Send the response with the success message
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 status for successful request
      success: true,
      message: "Product view tracked successfully", // Success message
    });
  } catch (error) {
    console.error("Error tracking product view:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error tracking product view", // Return an error message
    });
  }
});


//get recent product view by user

const getRecentProductView = catchAsync(async (req, res) => {
  try {
    const userId = req.user as JwtPayload;
    // Fetch the recent product views from the database
    const recentViews = await ProductService.getRecentProductViewFromDB(userId as JwtPayload);

    // Send the response with the recent product views
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 status for successful request
      success: true,
      message: "Recent product views retrieved successfully", // Success message
      data: recentViews, // Send the recent product views as the response
    });
  } catch (error) {
    console.error("Error getting recent product views:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error getting recent product views", // Return an error message
    });
  }
});







export const productController = {
  productCreate,
  getAllProducts,
  getProduct,
  productUpdate,
  productDuplicate,
  trackProductView,
  getRecentProductView,
};
