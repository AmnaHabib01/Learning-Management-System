import express from "express";
import { upload } from "../../core/middleware/multer.js";
// import { isLoggedIn } from "../../core/middleware/isLoggedIn.js"; // Not needed if no auth

import {
  getStudentProfile,
  updateStudent,
  updateStudentProfileImage,
  deleteStudentProfileImage,
} from "../../modules/student/student.controller.js";

const studentrouter = express.Router();
studentrouter.get("/:studentId", getStudentProfile);
studentrouter.put("/update/:studentId", upload.single("studentProfileImage"), updateStudent);
studentrouter.put("/:studentId/profile-image", upload.single("studentProfileImage"), updateStudentProfileImage);
studentrouter.delete("/:studentId/profile-image", deleteStudentProfileImage);
export default studentrouter;