import express from "express";
import { upload } from "../../core/middleware/multer.js";
// import { isLoggedIn } from "../../core/middleware/isLoggedIn.js"; // Not needed if no auth

import {
  getStudentProfile,
  getAllStudents,
  updateStudentProfile,
  deleteStudentProfileImage,
  deleteStudent,
  getTotalStudents,
} from "../../modules/student/student.controller.js";

const studentRouter = express.Router();
studentRouter.get("/all", getAllStudents);
studentRouter.get("/sumofall", getTotalStudents);
studentRouter.get("/studentprofile/:studentId", getStudentProfile);

// =================== Update Student (info + optional profile image) ===================
studentRouter.put(
  "/update/:studentId",
  upload.single("studentProfileImage"),
  updateStudentProfile
);
studentRouter.delete("/:studentId/profile-image", deleteStudentProfileImage);
studentRouter.delete("/delete/:studentId", deleteStudent);
export default studentRouter;