import express from "express";

import { userControllers } from "./user.controller";

import { USER_ROLE } from "./user.constant";
import authVerify from "../../middlewares/authVerify";

const router = express.Router();


router.get(
  "/me",
  authVerify(USER_ROLE.admin, USER_ROLE.user),
  userControllers.findUser
);
router.put(
  "/me",
  authVerify(USER_ROLE.admin, USER_ROLE.user),
  userControllers.updatedUser
);
export const UserRoutes = router;
