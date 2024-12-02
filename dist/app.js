"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const GlobalError_1 = __importDefault(require("./app/Error/GlobalError"));
const APInotFound_1 = __importDefault(require("./app/middlewares/APInotFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:5173", // Your frontend URL
        "https://best-buy-mart-backend-5cceda1dad93.herokuapp.com", // Backend URL (for production)
    ],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    optionsSuccessStatus: 200,
    allowedHeaders: "Content-Type, Authorization",
};
// Use CORS middleware
app.use((0, cors_1.default)(corsOptions));
// Routes
app.get("/", (req, res) => {
    res.send("Hello from setup file server running Good");
});
// Determine the path based on the environment
let uploadsPath;
if (process.env.NODE_ENV === "production") {
    // Heroku or production environment
    uploadsPath = path_1.default.join("/tmp", "uploads"); // Use /tmp folder for Heroku
}
else {
    // Local environment
    uploadsPath = path_1.default.resolve("D:/Web Level 2/Assignment 9/BestBuy Mart Backend/uploads");
}
console.log("Uploads path:", uploadsPath);
// Static file serving for the "uploads" folder
app.use("/uploads", express_1.default.static(uploadsPath));
// Your application routes
app.use("/api/v1", routes_1.default);
// Handle errors and not found routes
app.use(GlobalError_1.default);
app.use(APInotFound_1.default);
exports.default = app;
