"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createMemberIntoDB = async (memberData) => {
    const result = await prisma.member.create({
        data: Object.assign({}, memberData)
    });
    return result;
};
const RetrievesAllMembersFromDB = async () => {
    const result = await prisma.member.findMany({});
    return result;
};
const fetchSingleMemberByIdFromDB = async (id) => {
    try {
        const result = await prisma.member.findUniqueOrThrow({
            where: {
                memberId: id,
            },
        });
        return result;
    }
    catch (error) {
        // Handle the error here (optional)
        throw new Error("Member not found or some other error occurred");
    }
};
const MemberUpdatesByIdFromDB = async (id, memberData) => {
    const result = await prisma.member.update({
        where: {
            memberId: id,
        },
        data: memberData,
    });
    return result;
};
const MemberDeletesByIdFromDB = async (id) => {
    const result = await prisma.member.delete({
        where: {
            memberId: id,
        },
    });
    return result;
};
exports.memberService = {
    createMemberIntoDB,
    RetrievesAllMembersFromDB,
    fetchSingleMemberByIdFromDB,
    MemberUpdatesByIdFromDB,
    MemberDeletesByIdFromDB,
};
