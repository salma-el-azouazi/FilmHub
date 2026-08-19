import express from "express";
import { getMovieStats, reactToMovie, trackMovieView } from "../controllers/movieController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:movieKey/stats", optionalAuth, getMovieStats);
router.post("/:movieKey/view", optionalAuth, trackMovieView);
router.post("/:movieKey/reaction", optionalAuth, reactToMovie);

export default router;
