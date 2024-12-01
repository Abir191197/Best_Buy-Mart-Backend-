"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBorrowIntoDB = async (borrowData) => {
    return await prisma.$transaction(async (tx) => {
        // Fetch the book with the given ID to check available copies
        const book = await tx.book.findUnique({
            where: { bookId: borrowData.bookId },
            select: { availableCopies: true, title: true },
        });
        if (!book) {
            throw new Error("Book not found");
        }
        if (book.availableCopies <= 0) {
            throw new Error(`No available copies of "${book.title}" to borrow.`);
        }
        // Create the borrow record
        const borrowRecord = await tx.borrowRecord.create({
            data: Object.assign(Object.assign({}, borrowData), { borrowDate: new Date() }),
        });
        // Update the availableCopies count in the Book table
        await tx.book.update({
            where: { bookId: borrowData.bookId },
            data: {
                availableCopies: {
                    decrement: 1,
                },
            },
        });
        return borrowRecord;
    });
};
// Service to fetch overdue borrow records
const overdueBorrowListFromDB = async () => {
    // Get current date
    const currentDate = new Date();
    // Fetch borrow records where the book is not returned yet
    const overdueBooks = await prisma.borrowRecord.findMany({
        where: {
            returnDate: null, // Books that are not returned
            borrowDate: {
                lt: new Date(currentDate.setDate(currentDate.getDate() - 14)), // Borrow date is more than 14 days ago
            },
        },
        include: {
            book: true, // Include related book details
            member: true, // Include related member details
        },
    });
    // Map the results to include overdue days
    const result = overdueBooks.map((borrowRecord) => {
        // Calculate overdue days (current date - borrow date)
        const overdueDays = Math.floor((new Date().getTime() - new Date(borrowRecord.borrowDate).getTime()) /
            (1000 * 3600 * 24) - 14 // Calculate overdue days
        );
        return {
            borrowId: borrowRecord.borrowId,
            bookTitle: borrowRecord.book.title, // Book title
            borrowerName: borrowRecord.member.name, // Borrower's name
            overdueDays: overdueDays, // Overdue days
        };
    });
    return result;
};
exports.borrowService = {
    createBorrowIntoDB,
    overdueBorrowListFromDB,
};
