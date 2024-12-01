"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../Error/appError"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserFromDB = async (payload) => {
    try {
        if (payload !== null) {
            const result = await prisma.user
                .findUnique({
                where: { email: payload.email },
                select: {
                    userId: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    profileImg: true,
                    status: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false, // Exclude the password field
                },
            });
            return result;
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to Get User");
    }
};
const updatedUserIntoDB = async (payload, updateData) => {
    try {
        if (payload && payload.email) {
            const updatedUser = await prisma.user.update({
                where: { email: payload.email },
                data: Object.assign({}, updateData),
                select: {
                    userId: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    profileImg: true,
                    status: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return updatedUser;
        }
        else {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid payload");
        }
    }
    catch (error) {
        // Log the error for debugging purposes
        console.error("Error updating user:", error);
        if (error.code === "P2025") {
            // Specific Prisma error for record not found
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Re-throwing a general error
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to update user");
    }
};
exports.UserService = {
    findUserFromDB,
    updatedUserIntoDB,
};
