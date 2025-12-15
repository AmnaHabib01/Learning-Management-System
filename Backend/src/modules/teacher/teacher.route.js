import express from "express";
import { validate } from "../../core/middleware/validate.js";
import { upload } from "../../core/middleware/multer.js";
import {
  registerTeacherSchema,
  loginTeacherSchema,
  resetTeacherPasswordSchema,
  updateTeacherSchema
} from "../../shared/validators/teacher.validator.js"; // teacher validators
import {
  registerTeacher,
  logInTeacher,
  logoutTeacher,
  verifyTeacherMail,
  getTeacherAccessToken,
  forgotTeacherPasswordMail,
  resetTeacherPassword,
  getTeacherById,
  updateTeacher,
  getTotalTeachers
} from "./teacher.controller.js";
import { isLoggedIn } from "../../core/middleware/isLoggedIn.js";
import {authorizeRoles} from "../../core/middleware/authorizeRoles.js"

const teacherRouter = express.Router();

// ✅ Register Teacher (with optional profile image upload to AWS S3)
teacherRouter.post(
  "/register-teacher",
  isLoggedIn,
  authorizeRoles("admin"),
  upload.single("profileImage"),
  validate(registerTeacherSchema),
  registerTeacher
);

// 🔐 Login Teacher
teacherRouter.post("/login-teacher", validate(loginTeacherSchema), logInTeacher);

// 🚪 Logout Teacher
teacherRouter.post("/logout-teacher", isLoggedIn, logoutTeacher);

// ✉️ Verify Teacher Email
teacherRouter.get("/verify/:token", verifyTeacherMail);

// 🔁 Get Access Token
teacherRouter.get("/access-token",isLoggedIn, getTeacherAccessToken);

// 🔑 Forgot Password
teacherRouter.post("/forgot-password-mail", forgotTeacherPasswordMail);

// 🔒 Reset Password
teacherRouter.post(
  "/reset-password/:token",
  validate(resetTeacherPasswordSchema),
  resetTeacherPassword
);
// 📄 Get Single Teacher by ID
teacherRouter.get("/:id", isLoggedIn, getTeacherById);

// ✏️ Update Teacher (with optional profile image upload)
teacherRouter.put(
  "/:id",
  isLoggedIn,
  authorizeRoles("admin"),
  upload.single("profileImage"),
  validate(updateTeacherSchema),
  updateTeacher
);
teacherRouter.get("/total/count", isLoggedIn, authorizeRoles("admin"), getTotalTeachers);


export default teacherRouter;
