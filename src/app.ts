import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // Importing the CORS middleware
import globalErrorHandler from "./app/Error/GlobalError";
import APInotfound from "./app/middlewares/APInotFound";
import router from "./app/routes";

const app = express();

// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173", // Allowing only this origin for now
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
app.use("/api/v1", router);

// Handle errors and not found routes
app.use(globalErrorHandler);
app.use(APInotfound);

export default app;
