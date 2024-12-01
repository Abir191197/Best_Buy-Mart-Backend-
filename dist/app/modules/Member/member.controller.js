"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const member_service_1 = require("./member.service");
const createMember = (0, catchAsync_1.default)(async (req, res) => {
    const memberData = req.body; // Get the book data from the request body
    // Call the service to create the book in the database
    const result = await member_service_1.memberService.createMemberIntoDB(memberData);
    // Send response with success
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED, // Use CREATED (201) status code for successful creation
        success: true,
        message: "Member created successfully ",
        data: result,
    });
});
const RetrievesAllMembers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await member_service_1.memberService.RetrievesAllMembersFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Members retrieved successfully",
        data: result,
    });
});
const fetchSingleMemberById = (0, catchAsync_1.default)(async (req, res) => {
    const { memberId } = req.params;
    const result = await member_service_1.memberService.fetchSingleMemberByIdFromDB(memberId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Member retrieved successfully",
        data: result,
    });
});
const MemberUpdatesById = (0, catchAsync_1.default)(async (req, res) => {
    const { memberId } = req.params;
    const memberData = req.body;
    const result = await member_service_1.memberService.MemberUpdatesByIdFromDB(memberId, memberData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Member updated successfully",
        data: result,
    });
});
const MemberDeletesById = (0, catchAsync_1.default)(async (req, res) => {
    const { memberId } = req.params;
    const result = await member_service_1.memberService.MemberDeletesByIdFromDB(memberId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Member deleted successfully",
    });
});
exports.memberController = {
    createMember,
    RetrievesAllMembers,
    fetchSingleMemberById,
    MemberUpdatesById,
    MemberDeletesById,
};
