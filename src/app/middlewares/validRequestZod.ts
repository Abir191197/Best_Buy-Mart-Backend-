// middlewares/validateRequest.ts
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateRequest = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request data against the schema
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      next(); // Proceed to next middleware or route handler if validation is successful
    } catch (error) {
      if (error instanceof ZodError) {
        // Return a structured error response for validation errors
        res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.errors.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        });
      } else {
        next(error); // Pass non-validation errors to Express error handler
      }
    }
  };
};

export default validateRequest;
