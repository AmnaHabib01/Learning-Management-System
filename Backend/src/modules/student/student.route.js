import express from "express";
import { upload } from "../../core/middleware/multer.js";
// import { isLoggedIn } from "../../core/middleware/isLoggedIn.js"; // Not needed if no auth

import {
  getStudentProfile,
  updateStudent,
  updateStudentProfileImage,
  deleteStudentProfileImage,
} from "../../modules/student/student.controller.js";

const router = express.Router();
router.get("/:studentId", getStudentProfile);
router.put("/update/:studentId", upload.single("studentProfileImage"), updateStudent);
router.put("/:studentId/profile-image", upload.single("studentProfileImage"), updateStudentProfileImage);
router.delete("/:studentId/profile-image", deleteStudentProfileImage);

export default router;
