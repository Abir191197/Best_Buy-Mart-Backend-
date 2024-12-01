import { Request, Response } from "express";

import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../../config";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import AppError from "../../Error/appError";


// Helper function to set authentication cookies
const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("accessToken", accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
};

// SignIn function
const signUp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.signUpUser(req.body);
 const { email } = result;

 // Set HttpOnly and Secure cookies for refreshToken and accessToken
 

 // Filter user data to exclude sensitive information
 const userData = {
   email: email,
 };

 sendResponse(res, {
   statusCode: StatusCodes.OK,
   success: true,
   message: "User Sign Up successfully",
  
   data: userData,
 });
});

// LogIn function
const logIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.logInUser(req.body);
  const { user,accessToken, refreshToken } = result;

  // Set HttpOnly and Secure cookies for refreshToken and accessToken
  setAuthCookies(res, accessToken, refreshToken);

  // Filter user data to exclude sensitive information
  const userData = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    phone:user.phone,
    //address: result.user.address,
    role: user.role,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    token: accessToken,
    data: userData,
  });
});

// RefreshToken function
const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token not provided");
  }

  const result = await AuthServices.refreshToken(refreshToken);

  // Set new access token in cookie
  res.cookie("accessToken", result.accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token refreshed successfully!",
    token: result.accessToken,
    data: null,
  });
});


//verify OTP and sign up complete


const OtpVerification = catchAsync(async (req: Request, res: Response) => {
  
  const result = await AuthServices.OtpVerifyFromDB(req.body);
  const { user, accessToken, refreshToken } = result;

  // Set HttpOnly and Secure cookies for refreshToken and accessToken
  setAuthCookies(res, accessToken, refreshToken);

  // Filter user data to exclude sensitive information
  const userData = {
    userId: user.userId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    //address: result.user.address,
    role: user.role,
   
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User verify  successfully",
    token: accessToken,
    data: userData,
  });
});


const resendCode = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.resendOtpIntoDB(req.body);
  const { message } = result;

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP sent successfully",
    data: { message },
  });
});


// // Google OAuth callback
// const google = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user;

//   if (!user) {
//     // Redirect to the login page or any other appropriate action
//     return res.redirect("/");
//   }

//   // Call AuthServices.googleAuth to get or create the user and generate tokens
//   const { existingUser, accessToken, refreshToken } =
//     await AuthServices.googleAuth(user);

//   // Set cookies for access and refresh tokens
//   setAuthCookies(res, accessToken, refreshToken);

//   const userData = {
//     _id: existingUser._id,
//     name: existingUser.name,
//     email: existingUser.email,
//     phone: existingUser.phone,
//     address: existingUser.address,
//     role: existingUser.role,
//   };

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "User logged in successfully",
//     token: accessToken,
//     data: userData,
//   });
// });

export const AuthControllers = {
  signUp,
  logIn,
  refreshAccessToken,
  //google,
  OtpVerification,
  resendCode,
};
