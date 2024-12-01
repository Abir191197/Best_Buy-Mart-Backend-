"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
// routes/bookRoutes.ts
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./book.controller");
const book_validation_1 = require("./book.validation");
const validRequestZod_1 = __importDefault(require("../../middlewares/validRequestZod"));
const router = express_1.default.Router();
//  Creates a new book record in the library’s database.Endpoint: POST /api/books
router.post("/", (0, validRequestZod_1.default)(book_validation_1.BookSchemaValidator), book_controller_1.bookController.createBook);
//Retrieves a list of all books in the library. Endpoint: GET /api/books
router.get("/", book_controller_1.bookController.RetrievesBook);
//Fetches details of a specific book by its bookId.  Endpoint: GET /api/books/:bookId
router.get("/:bookId", book_controller_1.bookController.fetchSingleBookById);
//Update BookUpdates information of an existing book by its bookId. Endpoint: PUT /api/books/:bookId
router.put("/:bookId", book_controller_1.bookController.BookUpdatesById);
//Delete BookDeletes a book from the library by its bookId.Endpoint: DELETE /api/books/:bookId
router.delete("/:bookId", book_controller_1.bookController.BookDeletesById);
exports.BookRoutes = router;
