"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSchemaValidator = void 0;
// validators/bookValidator.ts
const zod_1 = require("zod");
// Define Zod schema for Book
exports.BookSchemaValidator = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Title is required" }).max(255, {
            message: "Title must be 255 characters or fewer",
        }),
        genre: zod_1.z.string().min(1, { message: "Genre is required" }).max(100, {
            message: "Genre must be 100 characters or fewer",
        }),
        publishedYear: zod_1.z
            .number()
            .int()
            .gte(1000)
            .lte(new Date().getFullYear())
            .optional(),
        totalCopies: zod_1.z.number().int().gte(1),
        availableCopies: zod_1.z.number().int().gte(0),
    }),
});
