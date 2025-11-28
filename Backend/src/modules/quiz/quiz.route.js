import { Router } from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
} from "./quiz.controller.js";
import { isLoggedIn } from "../../core/middleware/isLoggedIn.js";
import { authorizeRoles } from "../../core/middleware/authorizeRoles.js";

const router = Router();

// Admin/Teacher CRUD
router.post("/create",isLoggedIn,authorizeRoles("teacher"), createQuiz);
router.get("/all",isLoggedIn,authorizeRoles("teacher"), getAllQuizzes);
router.get("/:id",isLoggedIn,authorizeRoles("student","teacher"), getQuizById);
router.put("/update/:id",isLoggedIn,authorizeRoles("teacher"), updateQuiz);
router.delete("/delete/:id",isLoggedIn,authorizeRoles("teacher"), deleteQuiz);

// Student attempt
router.post("/attempt",isLoggedIn,authorizeRoles("student"), attemptQuiz);

export default router;
