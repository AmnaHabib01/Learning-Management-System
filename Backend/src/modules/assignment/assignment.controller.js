import { asyncHandler } from "../../core/utils/async-handler.js";

import Assignment from "../../models/Admin.model.js";
import Course from "../../models/Course.model.js";
import Teacher from "../../models/Teacher.model.js";
import Student from "../../models/Student.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";

// ---------------- Create Assignment ----------------
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, instructions, fileUrl, dueDate, course, createdBy } = req.body;

  // Validate course exists
  const courseExists = await Course.findById(course);
  if (!courseExists) throw new ApiError(404, "Course not found");

  // Validate teacher exists
  const teacherExists = await Teacher.findById(createdBy);
  if (!teacherExists) throw new ApiError(404, "Teacher not found");

  const assignment = await Assignment.create({
    title,
    instructions,
    fileUrl,
    dueDate,
    course,
    createdBy,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, assignment, "Assignment created successfully"));
});

// ---------------- Get All Assignments ----------------
export const getAllAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find()
    .populate("course", "title")
    .populate("createdBy", "name email")
    .populate("submissions.student", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, assignments, "All assignments fetched successfully"));
});

// ---------------- Get Single Assignment ----------------
export const getAssignmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id)
    .populate("course", "title")
    .populate("createdBy", "name email")
    .populate("submissions.student", "name email");

  if (!assignment) throw new ApiError(404, "Assignment not found");

  return res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment fetched successfully"));
});

// ---------------- Update Assignment ----------------
export const updateAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, instructions, fileUrl, dueDate } = req.body;

  const assignment = await Assignment.findById(id);
  if (!assignment) throw new ApiError(404, "Assignment not found");

  if (title) assignment.title = title;
  if (instructions) assignment.instructions = instructions;
  if (fileUrl) assignment.fileUrl = fileUrl;
  if (dueDate) assignment.dueDate = dueDate;

  await assignment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment updated successfully"));
});

// ---------------- Delete Assignment ----------------
export const deleteAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findByIdAndDelete(id);
  if (!assignment) throw new ApiError(404, "Assignment not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Assignment deleted successfully"));
});

// ---------------- Submit Assignment (Student) ----------------
export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, studentId, fileUrl } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new ApiError(404, "Assignment not found");

  const alreadySubmitted = assignment.submissions.find(
    (s) => s.student.toString() === studentId
  );
  if (alreadySubmitted) throw new ApiError(400, "Student has already submitted");

  assignment.submissions.push({ student: studentId, fileUrl });
  await assignment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment submitted successfully"));
});
