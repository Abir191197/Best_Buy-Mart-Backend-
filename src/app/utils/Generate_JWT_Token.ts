import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config"; // Adjust the path to your config file

// Generate Access Token
export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.JWT_ACCESS_TOKEN as string, {
    expiresIn: config.ACCESS_TOKEN_EXPIRED , 
  });
};

// Generate Refresh Token
export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.JWT_REFRESH_TOKEN as string, {
    expiresIn: config.REFRESH_TOKEN_EXPIRED , 
  });
};

// Verify Token
export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
