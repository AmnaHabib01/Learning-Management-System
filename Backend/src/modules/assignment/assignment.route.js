import { Router } from "express";
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
} from "./assignment.controller.js";

import { upload } from "../../core/middleware/multer.js";

const router = Router();

// Admin/Teacher CRUD
router.post("/create", upload.single("file"), createAssignment);
router.put("/:id", upload.single("file"), updateAssignment);
router.get("/all", getAllAssignments);
router.get("/:id", getAssignmentById);
router.delete("/:id", deleteAssignment);

// Student submit
router.post("/submit", upload.single("file"), submitAssignment);

export default router;