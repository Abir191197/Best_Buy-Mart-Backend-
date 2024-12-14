import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./app/Error/GlobalError";
import APInotfound from "./app/middlewares/APInotFound";
import router from "./app/routes";
import config from "./config";
const app = express();

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://best-buy-mart.vercel.app",
    "https://best-buy-mart-backend-5cceda1dad93.herokuapp.com", // Backend URL (for production)
  ],
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  optionsSuccessStatus: 200,
  allowedHeaders: "Content-Type, Authorization",
};

// Use CORS middleware
app.use(cors(corsOptions));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from setup file server running Good");
});

// Determine the path based on the environment
let uploadsPath: string;

if (config.NODE_ENV === "production") {
  // Heroku or production environment
  uploadsPath = path.join("/tmp", "uploads"); // Use /tmp folder for Heroku
} else {
  // Local environment
  uploadsPath = path.resolve(
    "D:/Web Level 2/Assignment 9/BestBuy Mart Backend/uploads"
  );
}

console.log("Uploads path:", uploadsPath);

// Static file serving for the "uploads" folder
app.use("/uploads", express.static(uploadsPath));

// Your application routes
app.use("/api/v1", router);

// Handle errors and not found routes
app.use(globalErrorHandler);
app.use(APInotfound);

export default app;
