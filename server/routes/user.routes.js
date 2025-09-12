const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../controllers/user.controller");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { registerValidation, validate } = require("../middleware/validation");

// Register new user
router.post("/register", registerValidation, validate, UserController.register);

// Login user
router.post("/login", UserController.login);

// Get all users (admin only)
router.get("/", authenticateToken, isAdmin, UserController.getAllUsers);

// Get user profile (authenticated)
router.get("/profile", authenticateToken, UserController.getProfile);

// Update user profile (authenticated)
router.put("/profile", authenticateToken, UserController.updateProfile);

// Password update validation rules
const passwordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain at least one special character (!@#$%^&*)"
    )
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),
];

// Update password routes (support both PUT and POST)
router.put(
  "/password",
  authenticateToken,
  passwordValidation,
  validate,
  UserController.updatePassword
);
router.post(
  "/update-password",
  authenticateToken,
  passwordValidation,
  validate,
  UserController.updatePassword
);

// Refresh token (authenticated)
router.post("/refresh", authenticateToken, UserController.refreshToken);

module.exports = router;
