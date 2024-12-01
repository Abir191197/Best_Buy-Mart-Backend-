"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const signUpValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Full name is required." }),
        email: zod_1.z
            .string({ required_error: "Email is required." })
            .email("Invalid email format."),
        //address: z.string({ required_error: "Address is required." }),
        phone: zod_1.z
            .string({ required_error: "Phone number is required." }),
        password: zod_1.z.string({ required_error: "Password is required." }),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "email is required." }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: "Refresh token is required",
        }),
    }),
});
exports.AuthValidation = {
    signUpValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
};
