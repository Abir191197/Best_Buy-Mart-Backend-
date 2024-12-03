import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import path from "path";

import config from "../../config/index"; 

// Initialize the S3 client with region and credentials
const s3 = new S3Client({
  region: "us-east-1", // The region where your S3 bucket is located
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY || "", // Replace with your AWS Access Key
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY || "", // Replace with your AWS Secret Key
  },
});

// Define storage configuration for Multer to upload directly to S3
const storage = multerS3({
  s3: s3,
  bucket: "best-buy-mart", // Replace with your S3 bucket name
  acl: "public-read", // Set file access permissions (public-read means anyone can view the file)
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileExt = path.extname(file.originalname); // Get file extension
    const uniqueName = Date.now() + fileExt; // Create a unique name based on the timestamp
    cb(null, uniqueName); // Set the file's key (name) in the S3 bucket
  },
});

// Initialize Multer with the S3 storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Example limit: 10 MB per file
});

// Export the upload function for use in routes
export const productImgUpload = {
  upload,
};
