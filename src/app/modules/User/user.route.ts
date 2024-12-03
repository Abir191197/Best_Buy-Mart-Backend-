import express from "express";

import { userControllers } from "./user.controller";

import { USER_ROLE } from "./user.constant";
import authVerify from "../../middlewares/authVerify";

const router = express.Router();


router.get(
  "/me",
  authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR),
  userControllers.findUser
);
router.put(
  "/me",
  authVerify(USER_ROLE.ADMIN, USER_ROLE.VENDOR),
  userControllers.updatedUser
);
export const UserRoutes = router;
