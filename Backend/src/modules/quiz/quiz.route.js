import { Router } from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
} from "./quiz.controller.js";

const router = Router();

// Admin/Teacher CRUD
router.post("/create", createQuiz);
router.get("/all", getAllQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

// Student attempt
router.post("/attempt", attemptQuiz);

export default router;
