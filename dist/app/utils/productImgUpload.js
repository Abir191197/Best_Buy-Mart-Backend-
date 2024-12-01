"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productImgUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Define storage options for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDirectory = "uploads"; // Directory to store uploaded images
        fs_1.default.mkdirSync(uploadDirectory, { recursive: true }); // Ensure directory exists
        cb(null, uploadDirectory); // Save the file to the uploads directory
    },
    filename: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname); // Get file extension
        const uniqueName = Date.now() + fileExt; // Create unique filename
        cb(null, uniqueName); // Set the filename
    },
});
// Create multer instance with storage options
const upload = (0, multer_1.default)({ storage: storage });
exports.productImgUpload = {
    upload,
};
