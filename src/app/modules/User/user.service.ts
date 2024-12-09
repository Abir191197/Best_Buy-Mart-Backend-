import { JwtPayload } from "jsonwebtoken";

import { PrismaClient, Status } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import AppError from "../../Error/appError";
import { TUser } from "./user.interface";

const prisma = new PrismaClient();

const findUserFromDB = async (payload: JwtPayload | null) => {
  try {
    // Check if the payload is null or undefined
    if (!payload?.email) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "User is not authenticated");
    }

    // Query Prisma to find the user by email
    const result = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        userId: true,
        email: true,
        name: true,
        role: true,
        profileImgSrc: true,
        profileImgSize: true,
        phone: true,
        street: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        password: false,
        shops: true,
        RecentProductView: true,
        Order: true,
        Review: true,
      },
    });

    // Check if the result is found
    if (!result) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Handle case where user status is pending
    if (result.status === "PENDING") {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "User account is pending activation."
      );
    }

    return result;
  } catch (error) {
    // Handle different types of errors (Prisma errors, validation errors, etc.)
    console.error("Error fetching user from DB:", error);
    if (error instanceof AppError) {
      throw error; // Re-throw custom AppError
    } else {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to get user"
      );
    }
  }
};

const updatedUserIntoDB = async (
  payload: JwtPayload | null,
  updateData: Partial<TUser>
) => {
  try {
    if (payload && payload.email) {
      const updatedUser = await prisma.user.update({
        where: { email: payload.email },
        data: {
          ...updateData, // Update with all the provided data (name, address, profile image, etc.)
        },
        select: {
          userId: true,
          email: true,
          name: true,
          role: true,
          profileImgSrc: true,
          profileImgSize: true,
          status: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid payload");
    }
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error updating user:", error);

    if (error.code === "P2025") {
      // Specific Prisma error for record not found
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Re-throwing a general error
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to update user");
  }
};

// Function to change the status of a user

const changeUserStatusInDB = async (userId: string, newStatus: Status) => {
  const updatedUser = await prisma.user.update({
    where: { userId: userId },
    data: { status: newStatus }, // Update the user's status
  });
  return updatedUser;
};

//create categories

const createCategoriesInDB = async (category: string) => {
  const result = await prisma.category.create({
    data: {
      category: category,
    },
  });
  return result;
};

export const UserService = {
  findUserFromDB,
  updatedUserIntoDB,
  changeUserStatusInDB,
  createCategoriesInDB,
};
