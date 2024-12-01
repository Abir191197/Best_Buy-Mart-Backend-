import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

import catchAsync from "../utils/catchAsync";
import AppError from "../Error/appError";
import { StatusCodes } from "http-status-codes";
import { TUserRole } from "../modules/User/user.constant";

// Extending Request type to include user property
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

const authVerify = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "Authorization token missing or malformed"
      );
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Token not provided");
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        config.JWT_ACCESS_TOKEN as string
      ) as JwtPayload;

      // Assign decoded payload to request object
      req.user = decoded;

      // Role checking
      const role = decoded.role;
      if (requiredRoles.length === 0 || requiredRoles.includes(role)) {
        return next();
      }

      // Unauthorized if user's role doesn't match required roles
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    } catch (error) {
      if (error === "TokenExpiredError") {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Token has expired, please log in again"
        );
      }
      // Handle other token verification errors
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
    }
  });
};

export default authVerify;
