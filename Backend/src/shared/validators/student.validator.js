import { z } from "zod";

// Password rules (same as teacher)
const passwordRules = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)");

// -------------------- Register Student schema --------------------
const registerStudentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: passwordRules,
  phoneNumber: z
    .string()
    .regex(/^(\+92|0)?3[0-9]{9}$/, "Invalid Pakistani phone number format")
    .optional(),
  address: z.string().min(5, "Address must be at least 5 characters long").optional(),
  profileImage: z.string().url("Invalid URL").optional(),
});

// -------------------- Login schema --------------------
const loginStudentSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// -------------------- Reset password schema --------------------
const resetStudentPasswordSchema = z.object({
  password: passwordRules,
});

// -------------------- Update Student info schema --------------------
const updateStudentSchema = z.object({
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
  registerStudentSchema,
  loginStudentSchema,
  resetStudentPasswordSchema,
  updateStudentSchema,
};
