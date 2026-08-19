import express from "express";
import { body } from "express-validator";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post(
  "/",
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("email")
    .isEmail()
    .withMessage("Enter a valid Gmail address")
    .bail()
    .normalizeEmail()
    .custom((value) => String(value).toLowerCase().endsWith("@gmail.com"))
    .withMessage("Please use a Gmail address"),
  body("subject").trim().isLength({ min: 3, max: 180 }),
  body("message").trim().isLength({ min: 10, max: 5000 }),
  sendContactMessage
);

export default router;
