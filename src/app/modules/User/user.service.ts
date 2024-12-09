import { JwtPayload } from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import AppError from "../../Error/appError";
import { TUser } from "./user.interface";

const prisma = new PrismaClient();

const findUserFromDB = async (payload: JwtPayload | null) => {
  try {
    if (payload !== null) {
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
      return result;
    }
  } catch (error) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to Get User");
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

export const UserService = {
  findUserFromDB,
  updatedUserIntoDB,
};
