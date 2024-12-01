"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnService = void 0;
/* This TypeScript code defines a service function `returnBookFromDB` that is responsible for returning
a borrowed book in a library system. Here's a breakdown of what the code does: */
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const returnBookFromDB = async (borrowIdObject) => {
    const { borrowId } = borrowIdObject; // Destructure to get the borrowId as a string
    return await prisma.$transaction(async (tx) => {
        // 1. Update the returnDate in BorrowRecord
        const updatedBorrowRecord = await tx.borrowRecord.update({
            where: { borrowId },
            data: { returnDate: new Date() }, // Set returnDate to now
        });
        // 2. Increment availableCopies in the Book table
        await tx.book.update({
            where: { bookId: updatedBorrowRecord.bookId },
            data: {
                availableCopies: {
                    increment: 1,
                },
            },
        });
        // Return the updated borrow record
        return updatedBorrowRecord;
    });
};
exports.returnService = {
    returnBookFromDB,
};
