import express from "express";
import {
  addComment,
  bookmarkPost,
  createPost,
  deleteComment,
  deletePost,
  getPost,
  likePost,
  listBookmarks,
  listPosts,
  likeComment,
  myPosts,
  trending,
  updateComment,
  updatePost
} from "../controllers/postController.js";
import { optionalAuth, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
const postUpload = upload.fields([
  { name: "featured_image", maxCount: 1 },
  { name: "trailer", maxCount: 1 }
]);

router.get("/", listPosts);
router.get("/trending", trending);
router.get("/me", protect, myPosts);
router.get("/bookmarks/me", protect, listBookmarks);
router.get("/:slug", optionalAuth, getPost);
router.post("/", protect, postUpload, createPost);
router.patch("/:id", protect, postUpload, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/:id/bookmark", protect, bookmarkPost);
router.post("/:id/comments", protect, addComment);
router.post("/:id/comments/:commentId/replies", protect, addComment);
router.patch("/comments/:commentId", protect, updateComment);
router.delete("/comments/:commentId", protect, deleteComment);
router.post("/comments/:commentId/like", protect, likeComment);

export default router;
