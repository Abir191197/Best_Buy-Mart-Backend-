"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors")); // Importing the CORS middleware
const GlobalError_1 = __importDefault(require("./app/Error/GlobalError"));
const APInotFound_1 = __importDefault(require("./app/middlewares/APInotFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// Parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS configuration
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://best-buy-mart-backend-5cceda1dad93.herokuapp.com", // Allowing only this origin for now
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
app.use("/api/v1", routes_1.default);
// Handle errors and not found routes
app.use(GlobalError_1.default);
app.use(APInotFound_1.default);
exports.default = app;
