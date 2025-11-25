import { asyncHandler } from "../../core/utils/async-handler.js";
import Quiz from "../../models/Quiz.model.js";
import Course from "../../models/Course.model.js";
import Teacher from "../../models/Teacher.model.js";
import Student from "../../models/Student.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";

// ---------------- Create Quiz ----------------
export const createQuiz = asyncHandler(async (req, res) => {
  const { title, questions, course, createdBy } = req.body;

  const courseExists = await Course.findById(course);
  if (!courseExists) throw new ApiError(404, "Course not found");

  const teacherExists = await Teacher.findById(createdBy);
  if (!teacherExists) throw new ApiError(404, "Teacher not found");

  const quiz = await Quiz.create({ title, questions, course, createdBy });

  return res
    .status(201)
    .json(new ApiResponse(201, quiz, "Quiz created successfully"));
});

// ---------------- Get All Quizzes ----------------
export const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find()
    .populate("course", "title")
    .populate("createdBy", "name email")
    .populate("attempts.student", "name email");

  return res.status(200).json(new ApiResponse(200, quizzes, "All quizzes fetched"));
});

// ---------------- Get Single Quiz ----------------
export const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id)
    .populate("course", "title")
    .populate("createdBy", "name email")
    .populate("attempts.student", "name email");

  if (!quiz) throw new ApiError(404, "Quiz not found");

  return res.status(200).json(new ApiResponse(200, quiz, "Quiz fetched successfully"));
});

// ---------------- Update Quiz ----------------
export const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, questions } = req.body;

  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  if (title) quiz.title = title;
  if (questions) quiz.questions = questions;

  await quiz.save();

  return res.status(200).json(new ApiResponse(200, quiz, "Quiz updated successfully"));
});

// ---------------- Delete Quiz ----------------
export const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findByIdAndDelete(id);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  return res.status(200).json(new ApiResponse(200, {}, "Quiz deleted successfully"));
});

// ---------------- Student Attempt Quiz ----------------
export const attemptQuiz = asyncHandler(async (req, res) => {
  const { quizId, studentId, answers } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  const alreadyAttempted = quiz.attempts.find(
    (a) => a.student.toString() === studentId
  );
  if (alreadyAttempted) throw new ApiError(400, "Student has already attempted this quiz");

  // Calculate score
  let score = 0;
  answers.forEach((ans) => {
    const q = quiz.questions.id(ans.questionId);
    if (q && q.correctAnswer === ans.answer) score += 1;
  });

  quiz.attempts.push({ student: studentId, answers, score });
  await quiz.save();

  return res.status(200).json(new ApiResponse(200, quiz, "Quiz attempted successfully"));
});
