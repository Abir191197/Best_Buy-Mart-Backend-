"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const productImgUpload_1 = require("../../utils/productImgUpload"); // Multer middleware for image upload
const shop_controller_1 = require("./shop.controller");
const authVerify_1 = __importDefault(require("../../middlewares/authVerify"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
// POST route to create a shop with images
router.post("/createShop", (0, authVerify_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.VENDOR), // Verify the user is authenticated
productImgUpload_1.productImgUpload.upload.array("images", 1), // Allows up to 1 image to be uploaded (logo)
(req, res, next) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
}, shop_controller_1.shopController.shopCreate // Call the controller's shop creation function
);
router.get("/getAllShop", (0, authVerify_1.default)(user_constant_1.USER_ROLE.ADMIN), // Verify the user is authenticated
shop_controller_1.shopController.getAllShop);
router.get("/getMyShop/:id", 
//authVerify(USER_ROLE.VENDOR),
shop_controller_1.shopController.getMyAllShopForVendor);
//Allow,Pending/Reject Shop by Admin only
router.put("/approveShop/:ShopId", 
//authVerify(USER_ROLE.ADMIN),
shop_controller_1.shopController.approveShopByAdmin);
router.put("/shopUpdate/:ShopId", 
//authVerify(USER_ROLE.VENDOR),
productImgUpload_1.productImgUpload.upload.array("images", 1), // Allows up to 1 image to be uploaded (logo)
(req, res, next) => {
    // Ensure req.body.data is parsed properly, and pass it to the controller
    req.body.data = JSON.parse(req.body.data);
    next(); // Continue to the next middleware (controller)
}, shop_controller_1.shopController.shopUpdate);
exports.shopRoutes = router;
