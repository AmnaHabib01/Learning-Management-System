import express from "express";
import { validate } from "../../core/middleware/validate.js";
import { upload } from "../../core/middleware/multer.js";
import {
  registerAdminSchema,
  loginAdminSchema,
  resetAdminPasswordSchema,
  updateAdminSchema,
} from "../../shared/validators/admin.validator.js"; // admin validators
import {
  registerAdmin,
  logInAdmin,
  logoutAdmin,
  verifyAdminMail,
  getAdminAccessToken,
  forgotAdminPasswordMail,
  resetAdminPassword,
  getAdminProfile,
  updateAdminProfile,
  getAllTeachers,
  deleteAdmin,
} from "./admin.controller.js";
import { isLoggedIn } from "../../core/middleware/isLoggedIn.js";

const adminRouter = express.Router();

// ✅ Register Admin (with optional profile image)
adminRouter.post(
  "/register-admin",
  upload.single("profileImage"),
  validate(registerAdminSchema),
  registerAdmin
);

// 🔐 Login Admin
adminRouter.post("/login-admin", validate(loginAdminSchema), logInAdmin);

// 🚪 Logout Admin
adminRouter.post("/logout-admin", isLoggedIn, logoutAdmin);

// ✉️ Verify Admin Email
adminRouter.get("/verify/:token", verifyAdminMail);

// 🔁 Get Access Token
adminRouter.get("/get-access-token", getAdminAccessToken);

// 🔑 Forgot Password
adminRouter.post("/forgot-password-mail", forgotAdminPasswordMail);

// 🔒 Reset Password
adminRouter.post(
  "/reset-password/:token",
  validate(resetAdminPasswordSchema),
  resetAdminPassword
);

// 👤 Get Admin Profile
adminRouter.get("/profile", isLoggedIn, getAdminProfile);

// ✏️ Update Admin Profile (with optional profile image)
adminRouter.put(
  "/Update-profile",
  isLoggedIn,
  upload.single("profileImage"),
  validate(updateAdminSchema),
  updateAdminProfile
);

// 🗑 Delete Admin Profile
adminRouter.delete("/profile", isLoggedIn, deleteAdmin);
adminRouter.get("/allteachers", isLoggedIn, getAllTeachers);

export default adminRouter;
