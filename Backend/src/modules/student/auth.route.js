import Router from "express";
import { upload } from "../../core/middleware/multer.js";
import { validate } from "../../core/middleware/validate.js";
import {   registerStudentSchema,loginStudentSchema,resetStudentPasswordSchema } from "../../shared/validators/student.validator.js";
import { registerStudent, loginStudent, logoutStudent, verifyStudentEmail, getStudentAccessToken, forgotPassword, resetPassword } from "./auth.controller.js";
import { isLoggedIn } from "../../core/middleware/isLoggedIn.js";

const studentAuthRouter = Router();

studentAuthRouter.post("/register", upload.single("profileImage"), validate(registerStudentSchema), registerStudent);
studentAuthRouter.post("/login", validate(loginStudentSchema), loginStudent);
studentAuthRouter.post("/logout", isLoggedIn, logoutStudent);
studentAuthRouter.get("/verify/:token", verifyStudentEmail);
studentAuthRouter.post("/access-token", getStudentAccessToken);
studentAuthRouter.post("/forgot-password", forgotPassword);
studentAuthRouter.post("/reset-password/:token", validate(resetStudentPasswordSchema), resetPassword);

export default studentAuthRouter;



// {
//     "studentEmail":"zumurd44@gmail.com",
//     "studentPassword":"Zumurd@1234"
// }