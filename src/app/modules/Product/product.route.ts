import express, { NextFunction, Request, Response } from "express";
import { productController } from "./product.controller";
import { productImgUpload } from "../../utils/productImgUpload"; // Multer middleware for image upload

const router = express.Router();

// POST route to create a product with images
router.post(
  "/createProduct",
  productImgUpload.upload.array("images", 5), // Allows up to 5 images to be uploaded
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
  },
  productController.productCreate // Call the controller's product creation function
);

export const productRoutes = router;
