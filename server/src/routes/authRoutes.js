import express from "express";
import { body } from "express-validator";
import {
  changePassword,
  confirmReset,
  forgotPassword,
  login,
  logout,
  me,
  register,
  resetPassword,
  restoreRememberedSession
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  register
);
router.post("/login", body("email").isEmail().normalizeEmail(), body("password").notEmpty(), login);
router.post("/remember", restoreRememberedSession);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post("/change-password", protect, body("newPassword").isLength({ min: 8 }), changePassword);
router.post("/forgot-password", body("email").isEmail().normalizeEmail(), forgotPassword);
router.get("/confirm-reset/:token", confirmReset);
router.post("/reset-password", body("token").isLength({ min: 32 }), body("password").isLength({ min: 8 }), resetPassword);

export default router;
