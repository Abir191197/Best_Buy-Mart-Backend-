import { z } from "zod";

const signUpValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Full name is required." }),
    email: z
      .string({ required_error: "Email is required." })
      .email("Invalid email format."),
    //address: z.string({ required_error: "Address is required." }),
    phone: z
      .string({ required_error: "Phone number is required." })
      ,
    password: z.string({ required_error: "Password is required." }),
  }),
});



const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required." }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required",
    }),
  }),
});

export const AuthValidation = {
    signUpValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
};
