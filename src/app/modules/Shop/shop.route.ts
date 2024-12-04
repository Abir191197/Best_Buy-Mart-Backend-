import express, { NextFunction, Request, Response } from "express";
import { productImgUpload } from "../../utils/productImgUpload"; // Multer middleware for image upload
import { shopController } from "./shop.controller";
import authVerify from "../../middlewares/authVerify";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// POST route to create a shop with images
router.post(
  "/createShop",
  //authVerify(USER_ROLE.ADMIN,USER_ROLE.VENDOR), // Verify the user is authenticated
  productImgUpload.upload.array("images", 1), // Allows up to 1 image to be uploaded (logo)
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
  },
  shopController.shopCreate // Call the controller's shop creation function
);


router.get("/getAllShop",
 authVerify(USER_ROLE.ADMIN), // Verify the user is authenticated
  shopController.getAllShop); 

router.get("/getMyShop/:id",
  //authVerify(USER_ROLE.VENDOR),
  shopController.getMyAllShopForVendor
)

//Allow,Pending/Reject Shop by Admin only
router.put(
  "/approveShop/:ShopId",
  //authVerify(USER_ROLE.ADMIN),
  shopController.approveShopByAdmin
);

router.put(
  "/shopUpdate/:ShopId",
  //authVerify(USER_ROLE.VENDOR),
  productImgUpload.upload.array("images", 1), // Allows up to 1 image to be uploaded (logo)
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
  },
  shopController.shopUpdate
);






export const shopRoutes = router;
