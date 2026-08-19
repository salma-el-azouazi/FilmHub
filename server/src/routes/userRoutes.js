import express from "express";
import {
  followUser,
  getProfile,
  listAuthors,
  markNotificationsRead,
  notifications,
  unfollowUser,
  updateProfile
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", listAuthors);
router.get("/notifications", protect, notifications);
router.patch("/notifications/read", protect, markNotificationsRead);
router.patch("/me", protect, upload.single("avatar"), updateProfile);
router.get("/:id", getProfile);
router.post("/:id/follow", protect, followUser);
router.delete("/:id/follow", protect, unfollowUser);

export default router;
