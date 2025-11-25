import { asyncHandler } from "../../core/utils/async-handler.js";
import Course from "../../models/Course.model.js";
import Teacher from "../../models/Teacher.model.js";
import Student from "../../models/Student.model.js";
import Assignment from "../../models/Assignment.model.js";
import Quiz from "../../models/Quiz.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";


// ---------------- Create Course ----------------
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, teachers, students, duration, creditHours } = req.body;

  // Validate teacher IDs
  if (teachers && teachers.length) {
    const existingTeachers = await Teacher.find({ _id: { $in: teachers } });
    if (existingTeachers.length !== teachers.length) {
      throw new ApiError(400, "Invalid teacher ID(s)");
    }
  }

  // Validate student IDs
  if (students && students.length) {
    const existingStudents = await Student.find({ _id: { $in: students } });
    if (existingStudents.length !== students.length) {
      throw new ApiError(400, "Invalid student ID(s)");
    }
  }

  const course = await Course.create({
    title,
    description,
    teachers,
    students,
    duration,
    creditHours,
  });

  return res.status(201).json(new ApiResponse(201, course, "Course created successfully"));
});

// ---------------- Get All Courses ----------------
export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate("teachers", "name email")
    .populate("students", "name email")
    .populate("assignments")
    .populate("quizzes");

  return res.status(200).json(new ApiResponse(200, courses, "All courses fetched successfully"));
});

// ---------------- Get Single Course ----------------
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id)
    .populate("teachers", "name email")
    .populate("students", "name email")
    .populate("assignments")
    .populate("quizzes");

  if (!course) throw new ApiError(404, "Course not found");

  return res.status(200).json(new ApiResponse(200, course, "Course fetched successfully"));
});

// ---------------- Update Course ----------------
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, teachers, students, duration, creditHours } = req.body;

  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, "Course not found");

  if (title) course.title = title;
  if (description) course.description = description;
  if (teachers) course.teachers = teachers;
  if (students) course.students = students;
  if (duration) course.duration = duration;
  if (creditHours) course.creditHours = creditHours;

  await course.save();

  return res.status(200).json(new ApiResponse(200, course, "Course updated successfully"));
});

// ---------------- Delete Course ----------------
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new ApiError(404, "Course not found");

  return res.status(200).json(new ApiResponse(200, {}, "Course deleted successfully"));
});
