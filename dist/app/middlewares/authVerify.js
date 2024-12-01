"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../Error/appError"));
const http_status_codes_1 = require("http-status-codes");
const authVerify = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Authorization token missing or malformed");
        }
        const token = authorizationHeader.split(" ")[1];
        if (!token) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token not provided");
        }
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_ACCESS_TOKEN);
            // Assign decoded payload to request object
            req.user = decoded;
            // Role checking
            const role = decoded.role;
            if (requiredRoles.length === 0 || requiredRoles.includes(role)) {
                return next();
            }
            // Unauthorized if user's role doesn't match required roles
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You do not have permission to access this resource");
        }
        catch (error) {
            if (error === "TokenExpiredError") {
                throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token has expired, please log in again");
            }
            // Handle other token verification errors
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid or expired token");
        }
    });
};
exports.default = authVerify;
