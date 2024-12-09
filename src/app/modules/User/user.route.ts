import express, { NextFunction, Request, Response } from "express";

import { userControllers } from "./user.controller";

import { USER_ROLE } from "./user.constant";
import authVerify from "../../middlewares/authVerify";
import { productImgUpload } from "../../utils/productImgUpload";

const router = express.Router();
//get user profile
router.get(
  "/me",
  authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR, USER_ROLE.USER),
  userControllers.findUser

);


//update user profile



router.put(
  "/me",
  authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR, USER_ROLE.USER),
  productImgUpload.upload.array("images", 1), // Allows up to 5 images to be uploaded
  (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
  },

  userControllers.updatedUser
);

//admin change user status

router.put(
  "/status/:userId",
  authVerify(USER_ROLE.ADMIN),
  userControllers.changeUserStatus
);

//admin create categories

router.post(
  "/createCategories",
  //authVerify(USER_ROLE.ADMIN),
  userControllers.createCategories
);






export const UserRoutes = router;
