import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDirectory = "uploads"; // Directory to store uploaded images
    fs.mkdirSync(uploadDirectory, { recursive: true }); // Ensure directory exists
    cb(null, uploadDirectory); // Save the file to the uploads directory
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // Get file extension
    const uniqueName = Date.now() + fileExt; // Create unique filename
    cb(null, uniqueName); // Set the filename
  },
});

// Create multer instance with storage options
const upload = multer({ storage: storage });

export const productImgUpload = {
  upload,
};
