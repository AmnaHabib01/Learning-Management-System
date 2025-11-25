import { z } from "zod";

// Password rules (same as teacher)
const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)");

// Register Student schema
const registerStudentSchema = z.object({
  studentName: z.string().min(3, "Name must be at least 3 characters long"),
  studentEmail: z.string().email("Invalid email"),
  studentPassword: passwordRules,
  studentPhoneNumber: z
    .string()
    .regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid Pakistani phone number format")
    .optional(),
  studentAddress: z.string().min(10, "Address must be at least 10 characters long").optional(),
  studentProfileImage: z.string().url("Invalid URL").optional(),
});

// Login schema
const loginStudentSchema = z.object({
  studentEmail: z.string().email("Invalid email"),
  studentPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

// Reset password schema
const resetStudentPasswordSchema = z.object({
  studentPassword: passwordRules,
});

//Update Student info schema
const updateStudentSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters long").optional(),
  studentEmail: z.string().email("Invalid email").optional(),
  studentPhoneNumber: z
    .string()
    .regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid Pakistani phone number format")
    .optional(),
  studentAddress: z.string().min(5, "Address must be at least 5 characters long").optional(),
  studentProfileImage: z.string().url("Invalid URL").optional(),
});

export {
  registerStudentSchema,
  loginStudentSchema,
  resetStudentPasswordSchema,
  updateStudentSchema,
};