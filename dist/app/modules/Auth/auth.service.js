"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const appError_1 = __importDefault(require("../../Error/appError"));
const Generate_JWT_Token_1 = require("../../utils/Generate_JWT_Token");
const client_1 = require("@prisma/client");
const sendOtpEmail_1 = __importDefault(require("../../utils/sendOtpEmail"));
const prisma = new client_1.PrismaClient();
//user sign Up
const signUpUser = async (payload) => {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
        select: { otpVerified: true }, // Only check the verification status
    });
    // If the user exists and is verified, throw an error
    if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.otpVerified) == true) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User already exists and is verified!");
    }
    // Generate a random 6-digit OTP
    const otp = crypto_1.default.randomInt(100000, 999999);
    // Hash the password
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
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
    const { password } = result, userWithoutSensitiveFields = __rest(result, ["password"]);
    // Send the OTP to the user's email
    //await sendOtpMail(userWithoutSensitiveFields.email, otp.toString());
    return { email: payload.email };
};
// login User
const logInUser = async (payload) => {
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
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "This user is not found!");
    }
    // Check if the user is active and email/OTP is verified
    if (user.status === "PENDING") {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "User account is pending activation.");
    }
    if (!user.otpVerified) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Please verify your OTP to activate the account.");
    }
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isMatch) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }
    // Generate JWT tokens
    const jwtPayload = { userId: user.userId, email: user.email, role: user.role, name: user.name || "USER" }; // Default role to "user" if undefined
    const accessToken = (0, Generate_JWT_Token_1.generateAccessToken)(jwtPayload);
    const refreshToken = (0, Generate_JWT_Token_1.generateRefreshToken)(jwtPayload);
    // Remove sensitive information (like password) before returning user data
    const { password } = user, userWithoutSensitiveData = __rest(user, ["password"]);
    return { user: userWithoutSensitiveData, accessToken, refreshToken };
};
// RefreshToken function
const refreshToken = async (token) => {
    const decoded = (0, Generate_JWT_Token_1.verifyToken)(token, config_1.default.JWT_REFRESH_TOKEN);
    const { email, role } = decoded;
    const jwtPayload = { email, role };
    const newAccessToken = (0, Generate_JWT_Token_1.generateAccessToken)(jwtPayload);
    return { accessToken: newAccessToken };
};
const OtpVerifyFromDB = async (payload) => {
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
            throw new appError_1.default(401, "Invalid OTP"); // Custom error handling or use StatusCodes directly
        }
        // Check if the OTP has expired
        const currentTime = new Date();
        if (!user.otpExpiresAt || currentTime > user.otpExpiresAt) {
            throw new appError_1.default(401, "OTP has expired");
        }
        // OTP is valid, generate JWT tokens
        const jwtPayload = {
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, Generate_JWT_Token_1.generateAccessToken)(jwtPayload); // Call your JWT generation function
        const refreshToken = (0, Generate_JWT_Token_1.generateRefreshToken)(jwtPayload); // Call your JWT refresh token generation function
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
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
const resendOtpIntoDB = async (payload) => {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (!existingUser) {
        throw new Error("User with this email does not exist.");
    }
    // Generate a random 6-digit OTP
    const otp = crypto_1.default.randomInt(100000, 999999);
    // Update the user's OTP and expiration time
    const updatedUser = await prisma.user.update({
        where: { email: payload.email },
        data: {
            verificationCode: otp.toString(),
            otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
    });
    // Send the OTP to the user's email
    await (0, sendOtpEmail_1.default)(updatedUser.email, otp.toString());
    return { message: "OTP has been resent successfully." };
};
exports.AuthServices = {
    signUpUser,
    logInUser,
    refreshToken,
    //googleAuth,
    OtpVerifyFromDB,
    resendOtpIntoDB,
};
