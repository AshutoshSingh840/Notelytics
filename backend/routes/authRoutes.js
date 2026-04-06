import express from "express";
import { body, validationResult } from "express-validator";

import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    error: errors.array()[0].msg,
    errors: errors.array(),
    statusCode: 400,
  });
};

// ================= Register Validation =================
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// ================= Login Validation =================
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ================= Public Routes =================
router.post("/register", registerValidation, handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors, login);

// ================= Protected Routes =================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);

export default router;
