import { z } from "zod";

// ✅ Create Assignment (Teacher)
export const createAssignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  instructions: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL").optional(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid due date",
  }),
  course: z.string().min(1, "Course ID is required"),
  createdBy: z.string().min(1, "Teacher ID is required"),
});

// ✅ Update Assignment
export const updateAssignmentSchema = z.object({
  title: z.string().min(3).optional(),
  instructions: z.string().optional(),
  fileUrl: z.string().url().optional(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
});

// ✅ Submit Assignment (Student)
export const submitAssignmentSchema = z.object({
  assignmentId: z.string().min(1, "Assignment ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  fileUrl: z.string().url("Invalid file URL"),
});
