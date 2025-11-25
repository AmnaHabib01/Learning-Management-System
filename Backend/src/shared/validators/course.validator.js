import { z } from "zod";

// ✔ ObjectId regex for MongoDB IDs
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// ---------------- CREATE COURSE SCHEMA ----------------
export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),

  teachers: z.array(objectId).optional(),
  students: z.array(objectId).optional(),

  duration: z.string().optional(),
  creditHours: z.number().min(1, "Credit hours must be at least 1").optional(),
});

// ---------------- UPDATE COURSE SCHEMA ----------------
export const updateCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").optional(),
  description: z.string().optional(),

  teachers: z.array(objectId).optional(),
  students: z.array(objectId).optional(),

  duration: z.string().optional(),
  creditHours: z.number().min(1, "Credit hours must be at least 1").optional(),
});
