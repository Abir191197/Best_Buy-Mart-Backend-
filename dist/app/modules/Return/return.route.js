"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnRoutes = void 0;
const express_1 = __importDefault(require("express"));
const return_controller_1 = require("./return.controller");
const router = express_1.default.Router();
//Create Member Adds a new member to the library./api/members
router.post("/", return_controller_1.returnController.returnBook);
exports.returnRoutes = router;
