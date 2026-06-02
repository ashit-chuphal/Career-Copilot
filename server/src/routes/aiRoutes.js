import express from "express";
import upload from "../utils/upload.js";
import { analyze, getHistory, deleteAnalysis} from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/analyze", protect, upload.single("resume"), analyze);
router.get("/history", protect, getHistory);
router.delete("/:id", protect, deleteAnalysis);

export default router;