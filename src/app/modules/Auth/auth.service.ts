import bcrypt from "bcrypt";
import crypto from "crypto";

import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import AppError from "../../Error/appError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/Generate_JWT_Token";
import { TUser } from "../User/user.interface";

import { PrismaClient } from "@prisma/client";
import sendOtpMail from "../../utils/sendOtpEmail";


const prisma = new PrismaClient();



//user sign Up

const signUpUser = async (payload: TUser) => {



  // Check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { otpVerified: true }, // Only check the verification status
  });

  // If the user exists and is verified, throw an error
  if (existingUser?.otpVerified==true) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "User already exists and is verified!"
    );
  }

  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999);

  // Hash the password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // Use Prisma's upsert to create or update the user
  const result = await prisma.user.upsert({
    where: { email: payload.email }, // Match the user by email
    update: {
      // Update the user if they are not verified
      name: payload.name,
      password: hashedPassword,
      phone: payload.phone,

      verificationCode: otp.toString(),
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    create: {
      // Create a new user if no existing user is found
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      role: payload.role,
    
      verificationCode: otp.toString(),
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  });

  // Remove the password from the response
  const { password, ...userWithoutSensitiveFields } = result;

  // Send the OTP to the user's email
  //await sendOtpMail(userWithoutSensitiveFields.email, otp.toString());

  return { email: payload.email };
};


// login User

const logInUser = async (payload: { email: string; password: string }) => {
  // Check if the user exists by email
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      email: true,
      password: true,
      role: true,
      userId: true,
      name: true,
      phone: true,
      status: true,
      otpVerified: true,
    }, // Select only necessary fields
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "This user is not found!");
  }

  // Check if the user is active and email/OTP is verified
  if (user.status === "PENDING") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "User account is pending activation."
    );
  }
  if (!user.otpVerified) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Please verify your OTP to activate the account."
    );
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
  }

  // Generate JWT tokens
  const jwtPayload = {userId:user.userId, email: user.email, role: user.role,name:user.name || "USER" }; // Default role to "user" if undefined
  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);

  // Remove sensitive information (like password) before returning user data
  const { password, ...userWithoutSensitiveData } = user;

  return { user: userWithoutSensitiveData, accessToken, refreshToken };
};


// RefreshToken function
const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.JWT_REFRESH_TOKEN as string);
  const { email, role } = decoded;

  const jwtPayload = { email, role };
  const newAccessToken = generateAccessToken(jwtPayload);

  return { accessToken: newAccessToken };
};





const OtpVerifyFromDB = async (payload: {
  email: string;
  verificationCode: string;
}) => {
  try {
    // Fetch user data based on the email and retrieve OTP and expiration time
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: payload.email },
      select: {
        email: true,
        role: true,
        userId: true,
        name: true,
        phone: true,
        verificationCode: true, // OTP stored in the database
        otpExpiresAt: true,
        otpVerified: true, // Expiry time for OTP
      },
    });

    // Check if the OTP is correct
    if (user.verificationCode !== payload.verificationCode) {
      throw new AppError(401, "Invalid OTP"); // Custom error handling or use StatusCodes directly
    }

    // Check if the OTP has expired
    const currentTime = new Date();
    if (!user.otpExpiresAt || currentTime > user.otpExpiresAt) {
      throw new AppError(401, "OTP has expired");
    }

    // OTP is valid, generate JWT tokens
    const jwtPayload = {
      email: user.email,
      role: user.role,
     
    };

    const accessToken = generateAccessToken(jwtPayload); // Call your JWT generation function
    const refreshToken = generateRefreshToken(jwtPayload); // Call your JWT refresh token generation function

    // Optional: You might want to clear the OTP after successful verification to prevent reuse
    await prisma.user.update({
      where: { email: payload.email },
      data: {
        status: "ACTIVE",
        verificationCode: null, // Clear OTP after successful verification
        otpExpiresAt: null,
        otpVerified: true, // Optionally clear the expiration date as well
      },
    });

    // Return the generated tokens and user data (excluding sensitive info like password)
    return {
      accessToken,
      refreshToken,
      user,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const resendOtpIntoDB = async (payload: { email: string }) => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!existingUser) {
    throw new Error("User with this email does not exist.");
  }

  // Generate a random 6-digit OTP
  const otp = crypto.randomInt(100000, 999999);

  // Update the user's OTP and expiration time
  const updatedUser = await prisma.user.update({
    where: { email: payload.email },
    data: {
      verificationCode: otp.toString(),
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  });

  // Send the OTP to the user's email
  await sendOtpMail(updatedUser.email, otp.toString());

  return { message: "OTP has been resent successfully." };
};






export const AuthServices = {
  signUpUser,
  logInUser,
  refreshToken,
  //googleAuth,
  OtpVerifyFromDB,
  resendOtpIntoDB,
};
