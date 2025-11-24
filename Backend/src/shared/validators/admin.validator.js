import { z } from "zod";

// 🧱 Step 1: Define password rules (same as teacher/user)
const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)");

// 🧱 Step 2: Register Admin schema
const registerAdminSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: passwordRules,
  courses: z.array(z.string()).optional(),
  profileImage: z.string().url("Invalid URL").optional(),
});

// 🧱 Step 3: Login schema
const loginAdminSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// 🧱 Step 4: Reset password schema
const resetAdminPasswordSchema = z.object({
  password: passwordRules,
});

// 🧱 Step 5: Update admin info schema
const updateAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  email: z.string().email("Invalid email").optional(),
  courses: z.array(z.string()).optional(),
  profileImage: z.string().url("Invalid URL").optional(),
});

export {
  registerAdminSchema,
  loginAdminSchema,
  resetAdminPasswordSchema,
  updateAdminSchema,
};
