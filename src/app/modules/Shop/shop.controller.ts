
//create shop only VENDOR AND ADMIN CAN CREATE SHOP
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; // Importing HTTP status codes
import { ShopService } from "./shop.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { Shop_Status } from "@prisma/client";
 // Assuming the response utility is here

const shopCreate = catchAsync( async (req, res) => {
  try {
    const { data } = req.body;
    const { name, description, userId } = data;
    // Extract shop data from the request body
    const images = req.files as (Express.Multer.File & { location: string })[]; // Get the uploaded images with S3 location

    // Construct the shopData object, including S3 image URLs
    const shopData = {
      name,
      logoImgPath: images.length > 0 ? images[0].location : undefined, // Assuming the first image is the profile picture
      logoImgSize: images.length > 0 ? images[0].size : undefined, // If size is needed for profile image
      description,
      userId,
    };
  
    // Save shop data into the database
    const result = await ShopService.createShopIntoDB(shopData);

    // Return the response using the sendResponse utility
    sendResponse(res, {
      statusCode: StatusCodes.CREATED, // 201 status for created resources
      success: true,
      message: "Shop created successfully", // Correct success message
      data: result,
    });
  } catch (error) {
    console.error("Error creating shop:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating shop" });
  }
});



//ONLY FOR ADMIN TO GET ALL SHOP

const getAllShop = catchAsync(async (req, res) => {

  try {
    // Call the service method to get all shops from the database
    const result = await ShopService.getAllShopFromDB();

    // Send a response with the result (shops)
    sendResponse(res, {
      statusCode: 200, // 200 OK
      success: true,
      message: "Shops retrieved successfully", // Success message
      data: result, // Return the retrieved shops
    });
  } catch (error) {
    console.error("Error getting all shops:", error);
    res.status(500).json({ message: "Error getting all shops" }); // Return an error response
  }
});


const getMyAllShopForVendor = catchAsync(async (req, res) => {
  try {
    const { UserId } = req.params; // Extract the user ID from the request parameters

    // Call the service method to get all shops for the user
    const result = await ShopService.getMyShopFromDB(UserId);

    // Send a response with the result (shops)
    sendResponse(res, {
      statusCode: 200, // 200 OK
      success: true,
      message: "Shops retrieved successfully", // Success message
      data: result, // Return the retrieved shops
    });
  } catch (error) {
    console.error("Error getting all shops:", error);
    res.status(500).json({ message: "Error getting all shops" }); // Return an error response
  }
});


const approveShopByAdmin = catchAsync(async (req, res) => {
  try {
    const { ShopId } = req.params;
    const { statusAction } = req.body;// Extract the shop ID from the request parameters
    console.log(ShopId, statusAction);

    // Call the service method to approve the shop by ID
    const result = await ShopService.approveShopByIdIntoDB(
      ShopId,
      statusAction as   Shop_Status
    );

    // Send a response with the result (approved shop)
    sendResponse(res, {
      statusCode: 200, // 200 OK
      success: true,
      message: "Shop approved successfully", // Success message
      data: result, // Return the approved shop
    });
  } catch (error) {
    console.error("Error approving shop:", error);
    res.status(500).json({ message: "Error approving shop" }); // Return an error response
  }
});


const shopUpdate = catchAsync(async (req, res) => {
  try {
    const { ShopId } = req.params; // Get the ShopId from the request parameters
    const { data } = req.body; // Extract the updated shop data from the request body
    console.log("data from shop", data);
  const images = req.files as (Express.Multer.File & { location: string })[];

    // Construct the updated shopData object, including S3 image URLs
    const shopData = {
      ...data,
      images: images?.map((file) => ({
        path: file.location, // S3 URL of the uploaded image
        size: file.size, // Image size
      })),
    };

    // Update the shop data in the database using the ShopService
    const updatedShop = await ShopService.updateShopInDB(ShopId, shopData);

    // Return the response using the sendResponse utility
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 status for successful update
      success: true,
      message: "Shop updated successfully", // Success message
      data: updatedShop, // Return the updated shop data
    });
  } catch (error) {
    console.error("Error updating shop:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating shop" });
  }
});



export const shopController = {
  shopCreate,
  getAllShop,
  getMyAllShopForVendor,
  approveShopByAdmin,
  shopUpdate,
};
