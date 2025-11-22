import { z } from "zod";

// 🧱 Step 1: Define password rules (same as user)
const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)");

// 🧱 Step 2: Register Teacher schema
const registerTeacherSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: passwordRules,
  phoneNumber: z
    .string()
    .regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid Pakistani phone number format")
    .optional(),
  address: z.string().min(10, "Address must be at least 10 characters long").optional(),
  profileImage: z.string().url("Invalid URL").optional(),
});

// 🧱 Step 3: Login schema
const loginTeacherSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// 🧱 Step 4: Reset password schema
const resetTeacherPasswordSchema = z.object({
  password: passwordRules,
});

// 🧱 Step 5: Update teacher info schema
const updateTeacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.string().email("Invalid email").optional(),
  phoneNumber: z
    .string()
    .regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid Pakistani phone number format")
    .optional(),
  address: z.string().min(5, "Address must be at least 5 characters long").optional(),
  profileImage: z.string().url("Invalid URL").optional(),
});

export {
  registerTeacherSchema,
  loginTeacherSchema,
  resetTeacherPasswordSchema,
  updateTeacherSchema,
};
