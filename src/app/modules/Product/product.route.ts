import express, { NextFunction, Request, Response } from "express";
import { productController } from "./product.controller";
import { productImgUpload } from "../../utils/productImgUpload"; // Multer middleware for image upload
import authVerify from "../../middlewares/authVerify";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// POST route to create a product with images
router.post(
  "/createProduct",
  authVerify(USER_ROLE.ADMIN,USER_ROLE.VENDOR), // Verify the user is authenticated
  productImgUpload.upload.array("images", 5), // Allows up to 5 images to be uploaded
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
  },
  productController.productCreate // Call the controller's product creation function
);

// GET route to retrieve all products from  all shop

router.get("/allProducts",

  productController.getAllProducts);

router.put(
  "/updateProduct/:productId",
  //authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR), // Verify the user is authenticated
  productImgUpload.upload.array("images", 5), // Allows up to 5 images to be uploaded
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
  },
  productController.productUpdate // Call the controller's product update function
);



router.post(
  "/duplicateProduct/:productId",
  //authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR), // Verify the user is authenticated
  productImgUpload.upload.array("images", 5), // Allows up to 5 images to be uploaded
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
  },
  productController.productDuplicate // Call the controller's product creation function
);


//get single product

router.get("/getProduct/:productId", productController.getProduct);

//Track recent  products view by user
router.post(
  "/trackProductView/:productId",
  authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR, USER_ROLE.USER), // Verify the user is authenticated
  productController.trackProductView
);

//get recent products view by user

router.get("/recentProductView",
  
  authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR,USER_ROLE.USER), // Verify the user is authenticated
  productController.getRecentProductView);




export const productRoutes = router;
