import { asyncHandler } from "../../core/utils/async-handler.js";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";
import Student from "../../models/Student.model.js";
import Quiz from "../../models/Quiz.model.js";
import Assignment from "../../models/Assignment.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { updateStudentSchema } from "../../shared/validators/student.validator.js";

// =================== Get Student profile ===================
export const getStudentProfile = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId)
    .populate({ path: "quizzes", select: "title course" })
    .populate({ path: "assignments", select: "title course" });

  if (!student) throw new ApiError(404, "Student not found");

  const studentObj = student.toObject();
  if (studentObj.profileImage) {
    studentObj.profileImageUrl = await S3UploadHelper.getSignedUrl(studentObj.profileImage).catch(() => null);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, studentObj, "Student profile retrieved successfully"));
});


// =================== Get All Students ===================
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().lean(); // Use lean() for plain JS objects

  // Add signed URLs for each student
  const studentsWithUrls = await Promise.all(
    students.map(async (student) => {
      if (student.profileImage) {
        student.profileImageUrl = await S3UploadHelper.getSignedUrl(student.profileImage).catch(() => null);
      }
      return student;
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, studentsWithUrls, "All students retrieved successfully"));
});

// =================== Update Student (including Profile Image) ===================
export const updateStudentProfile = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Validate input data
  const parsedData = updateStudentSchema.safeParse(req.body);
  if (!parsedData.success) {
    const errors = parsedData.error.errors.map((e) => e.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const allowedFields = ["name", "email", "phoneNumber", "address", "rollNo", "className", "section"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (parsedData.data[field] !== undefined) updates[field] = parsedData.data[field];
  });

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  // Handle profile image update if file is provided
  if (req.file) {
    if (student.profileImage) {
      await S3UploadHelper.deleteFile(student.profileImage).catch(() => {});
    }
    const uploadResult = await S3UploadHelper.uploadFile(req.file, "student-profiles");
    if (uploadResult?.key) updates.profileImage = uploadResult.key;
  }

  // Update student
  Object.assign(student, updates);
  await student.save();

  // Add signed URL
  const studentObj = student.toObject();
  if (studentObj.profileImage) {
    studentObj.profileImageUrl = await S3UploadHelper.getSignedUrl(studentObj.profileImage).catch(() => null);
  }

  return res.status(200).json(new ApiResponse(200, studentObj, "Student updated successfully"));
});

// =================== Delete Profile Image ===================
export const deleteStudentProfileImage = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");
  if (!student.profileImage) throw new ApiError(400, "Student does not have a profile image");

  await S3UploadHelper.deleteFile(student.profileImage);
  student.profileImage = null;
  await student.save();

  return res.status(200).json(new ApiResponse(200, null, "Profile image deleted successfully"));
});

// =================== Add Quiz Attempt ===================
export const addQuizToStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { quizId } = req.body;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const quizExists = await Quiz.exists({ _id: quizId });
  if (!quizExists) throw new ApiError(404, "Quiz not found");

  if (!student.quizzes.includes(quizId)) student.quizzes.push(quizId);
  await student.save();

  return res.status(200).json(new ApiResponse(200, student.quizzes, "Quiz added to student successfully"));
});

// =================== Add Assignment Submission ===================
export const addAssignmentToStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { assignmentId } = req.body;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const assignmentExists = await Assignment.exists({ _id: assignmentId });
  if (!assignmentExists) throw new ApiError(404, "Assignment not found");

  if (!student.assignments.includes(assignmentId)) student.assignments.push(assignmentId);
  await student.save();

  return res.status(200).json(new ApiResponse(200, student.assignments, "Assignment added to student successfully"));
});
//delete
export const deleteStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Find the student
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  // Delete profile image from S3 if exists
  if (student.profileImage) {
    await S3UploadHelper.deleteFile(student.profileImage).catch(() => {});
  }

  // Optional: Remove student from quizzes/assignments if needed
  // await Quiz.updateMany({ students: studentId }, { $pull: { students: studentId } });
  // await Assignment.updateMany({ students: studentId }, { $pull: { students: studentId } });

  // Delete the student
  await Student.findByIdAndDelete(studentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Student deleted successfully"));
});
//total students
// =================== Get Total Number of Students ===================
export const getTotalStudents = asyncHandler(async (req, res) => {
  const totalStudents = await Student.countDocuments(); // <-- do not use findById
  return res
    .status(200)
    .json(new ApiResponse(200, { total: totalStudents }, "Total number of students retrieved successfully"));
});
