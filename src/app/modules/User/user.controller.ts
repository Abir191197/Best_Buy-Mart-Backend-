
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";



// Controller to handle retrieving a user profile
const findUser = catchAsync(async (req, res) => {
  if (!req.user) {
    // Handle case where req.user is undefined
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  try {
    const result = await UserService.findUserFromDB(req.user);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve user profile",
      data: null,
    });
  }
});

// Controller to handle updating a user profile
const updatedUser = catchAsync(async (req, res) => {
  if (!req.user) {
    // Handle case where req.user is undefined (user not authenticated)
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  try {
    const { data } = req.body; // Extract other user data from the request body
    const { name, phone, street, city, state, postalCode, country } = data; // Extract name and address data
    const images = req.files as (Express.Multer.File & { location: string })[]; // Get the uploaded images with S3 location

    // Construct the user data object, including name, S3 image URLs, and address fields
    const userData = {
      name, // Update the name
      profileImgSrc: images.length > 0 ? images[0].location : undefined, // Assuming the first image is the profile picture
      profileImgSize: images.length > 0 ? images[0].size : undefined, // If size is needed for profile image
      phone,
      street,
      city,
      state,
      postalCode,
      country,
    };

  
    // Update the user in the database with the new data
    const result = await UserService.updatedUserIntoDB(req.user, userData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to update profile",
      data: null,
    });
  }
});


export const userControllers = {
 
  findUser,
  updatedUser,
};
