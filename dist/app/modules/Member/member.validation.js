"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberSchemaValidator = void 0;
const zod_1 = require("zod");
// Define Zod schema for Member
exports.MemberSchemaValidator = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, { message: "Name is required" })
            .max(255, { message: "Name must be 255 characters or fewer" }),
        email: zod_1.z.string().email({ message: "Invalid email format" }),
        phone: zod_1.z
            .string()
            .min(10, { message: "Phone number should be at least 10 digits" })
            .max(15, { message: "Phone number should not exceed 15 digits" }),
    }),
});
