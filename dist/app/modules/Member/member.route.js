"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validRequestZod_1 = __importDefault(require("../../middlewares/validRequestZod"));
const member_validation_1 = require("./member.validation");
const member_controller_1 = require("./member.controller");
const router = express_1.default.Router();
//Create Member Adds a new member to the library./api/members
router.post("/", (0, validRequestZod_1.default)(member_validation_1.MemberSchemaValidator), member_controller_1.memberController.createMember);
//Read All Members Retrieves a list of all members in the library.Endpoint: GET /api/members
router.get("/", member_controller_1.memberController.RetrievesAllMembers);
//GET /api/members/:memberId
router.get("/:memberId", member_controller_1.memberController.fetchSingleMemberById);
//Update Member Updates information for a specific member by their memberId.Endpoint: PUT /api/members/:memberId
router.put("/:memberId", member_controller_1.memberController.MemberUpdatesById);
//Delete Member Deletes a member from the library by their memberId. Endpoint: DELETE /api/members/:memberId
router.delete("/:memberId", member_controller_1.memberController.MemberDeletesById);
exports.MemberRoutes = router;
