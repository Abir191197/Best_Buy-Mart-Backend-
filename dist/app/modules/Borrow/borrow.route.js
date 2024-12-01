"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("./borrow.controller");
const router = express_1.default.Router();
//Create Member Adds a new member to the library./api/members
router.post("/", borrow_controller_1.borrowController.createBorrow);
//Overdue Borrow List Endpoint: GET /api/borrow/overdue
router.get("/overdue", borrow_controller_1.borrowController.overdueBorrowList);
exports.BorrowRoutes = router;
