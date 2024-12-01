"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            // Validate request data against the schema
            await schema.parseAsync({
                body: req.body,
                cookies: req.cookies,
            });
            next(); // Proceed to next middleware or route handler if validation is successful
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Return a structured error response for validation errors
                res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: error.errors.map((e) => ({
                        path: e.path,
                        message: e.message,
                    })),
                });
            }
            else {
                next(error); // Pass non-validation errors to Express error handler
            }
        }
    };
};
exports.default = validateRequest;
