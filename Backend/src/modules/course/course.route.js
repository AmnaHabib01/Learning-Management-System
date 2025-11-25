import { Router } from "express";
import { validate } from "../../core/middleware/validate.js";
import { createCourseSchema, updateCourseSchema } from "../../shared/validators/course.validator.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "./course.controller.js";

const courseRouter = Router();

// -------------------- Routes with Validation --------------------

// Create Course
courseRouter.post("/create", validate(createCourseSchema), createCourse);

// Get All Courses
courseRouter.get("/all", getAllCourses);

// Get Single Course
courseRouter.get("/:id", getCourseById);

// Update Course
courseRouter.put("/:id", validate(updateCourseSchema), updateCourse);

// Delete Course
courseRouter.delete("/:id", deleteCourse);

export default courseRouter;
