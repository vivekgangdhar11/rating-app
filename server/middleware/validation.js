const { body, validationResult } = require("express-validator");

/**
 * User registration validation rules
 */
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 20, max: 200 })
    .withMessage("Minimum length 20 characters required"),
  body("email").trim().isEmail().withMessage("Must be a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("address")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Address must not exceed 400 characters"),
  body("role")
    .isIn(["admin", "user", "owner"])
    .withMessage("Invalid role specified"),
];

/**
 * Store validation rules
 */
const storeValidation = [
  body("name").trim().notEmpty().withMessage("Store name is required"),
  body("email").trim().isEmail().withMessage("Must be a valid email address"),
  body("address").trim().notEmpty().withMessage("Store address is required"),
];

/**
 * Rating validation rules
 */
const ratingValidation = [
  body("storeId")
    .notEmpty()
    .withMessage("Store ID is required")
    .isInt({ min: 1 })
    .withMessage("Invalid store ID"),
  body("score")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  storeValidation,
  ratingValidation,
  validate,
};
