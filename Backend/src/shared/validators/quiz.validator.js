import { z } from "zod";

// ✅ Question Schema
const questionSchema = z.object({
  questionText: z.string().min(3, "Question text required"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required"),
  correctAnswer: z.string().min(1, "Correct answer required"),
});

// ✅ Create Quiz (Teacher)
export const createQuizSchema = z.object({
  title: z.string().min(3, "Quiz title required"),
  course: z.string().min(1, "Course ID required"),
  createdBy: z.string().min(1, "Teacher ID required"),
  questions: z.array(questionSchema).min(1, "At least 1 question required"),
});

// ✅ Update Quiz
export const updateQuizSchema = z.object({
  title: z.string().min(3).optional(),
  questions: z.array(questionSchema).optional(),
});

// ✅ Attempt Quiz (Student)
export const attemptQuizSchema = z.object({
  quizId: z.string().min(1, "Quiz ID required"),
  studentId: z.string().min(1, "Student ID required"),
  answers: z.array(
    z.object({
      questionId: z.string().min(1, "Question ID required"),
      answer: z.string().min(1, "Answer required"),
    })
  ).min(1, "At least one answer required"),
});
