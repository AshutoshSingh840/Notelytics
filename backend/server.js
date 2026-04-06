import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerUi, swaggerSpec } from './swagger.js';

import connectDB from "./config/db.js";
import errorhandler from "./middleware/errorHandler.js";

// ES6 __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// ================= Middleware =================

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (FIXED)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Routes =================
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);


// ================= 404 handler =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    statusCode: 404,
  });
});

// ================= Global error handler =================
app.use(errorhandler);

// ================= Start server =================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});

// ================= Handle unhandled promise rejections =================
process.on("unhandledRejection", (err) => {
  console.error(`❌ Error: ${err.message}`);
  process.exit(1);
});
