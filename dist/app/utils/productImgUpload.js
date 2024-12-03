"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productImgUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../../config/index"));
// Initialize the S3 client with region and credentials
const s3 = new client_s3_1.S3Client({
    region: "us-east-1", // The region where your S3 bucket is located
    credentials: {
        accessKeyId: index_1.default.AWS_ACCESS_KEY || "", // Replace with your AWS Access Key
        secretAccessKey: index_1.default.AWS_SECRET_ACCESS_KEY || "", // Replace with your AWS Secret Key
    },
});
// Define storage configuration for Multer to upload directly to S3
const storage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: "best-buy-mart", // Replace with your S3 bucket name
    acl: "public-read", // Set file access permissions (public-read means anyone can view the file)
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname); // Get file extension
        const uniqueName = Date.now() + fileExt; // Create a unique name based on the timestamp
        cb(null, uniqueName); // Set the file's key (name) in the S3 bucket
    },
});
// Initialize Multer with the S3 storage configuration
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Example limit: 10 MB per file
});
// Export the upload function for use in routes
exports.productImgUpload = {
    upload,
};
