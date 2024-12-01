"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBikeIntoDB = async (BookData) => {
    const result = await prisma.book.create({
        data: BookData,
    });
    return result;
};
const RetrievesBookFromDB = async () => {
    const result = await prisma.book.findMany({});
    return result;
};
const fetchSingleBookByIdFromDB = async (id) => {
    try {
        // Fetch book by the provided bookId (UUID)
        const result = await prisma.book.findUniqueOrThrow({
            where: {
                bookId: id, // Use bookId for lookup, assuming it's a UUID
            },
        });
        // Return the book if found
        return result;
    }
    catch (error) {
        // Handle error if the book is not found
        throw new Error("Book not found or some other error occurred");
    }
};
const BookUpdatesByIdFromDB = async (id, bookData) => {
    const result = await prisma.book.update({
        where: {
            bookId: id,
        },
        data: bookData,
    });
    return result;
};
const BookDeletesByIdFromDB = async (id) => {
    const result = await prisma.book.delete({
        where: {
            bookId: id,
        },
    });
    return result;
};
exports.bookService = {
    createBikeIntoDB,
    RetrievesBookFromDB,
    fetchSingleBookByIdFromDB,
    BookUpdatesByIdFromDB,
    BookDeletesByIdFromDB,
};
