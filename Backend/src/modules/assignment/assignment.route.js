import { Router } from "express";
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
} from "./assignment.controller.js";

const router = Router();

// Admin/Teacher CRUD
router.post("/create", createAssignment);
router.get("/all", getAllAssignments);
router.get("/:id", getAssignmentById);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

// Student submit
router.post("/submit", submitAssignment);

export default router;
