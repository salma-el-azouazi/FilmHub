import express from "express";
import { createCategory, deleteCategory, mergeCategory, updateCategory } from "../controllers/categoryController.js";
import {
  dashboard,
  broadcastNotification,
  deleteComment,
  deleteUser,
  listComments,
  listPostsAdmin,
  listUsers,
  moderatePost,
  updateUser
} from "../controllers/adminController.js";
import { createUser } from "../controllers/userController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", dashboard);
router.get("/analytics", dashboard);
router.post("/notifications/broadcast", broadcastNotification);
router.get("/users", listUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/posts", listPostsAdmin);
router.patch("/posts/:id", moderatePost);
router.delete("/posts/:id", async (req, res, next) => {
  try {
    const { pool } = await import("../config/db.js");
    await pool.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
});
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.post("/categories/:id/merge", mergeCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/comments", listComments);
router.delete("/comments/:id", deleteComment);

export default router;
