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

// =================== Update Student ===================
export const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const parsedData = updateStudentSchema.safeParse(req.body);
  if (!parsedData.success) {
    const errors = parsedData.error.errors.map((e) => e.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const allowedFields = ["name", "email", "phoneNumber", "address"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (parsedData.data[field] !== undefined) updates[field] = parsedData.data[field];
  });

  if (req.file) {
    const oldStudent = await Student.findById(studentId);
    if (!oldStudent) throw new ApiError(404, "Student not found");

    if (oldStudent.profileImage) {
      await S3UploadHelper.deleteFile(oldStudent.profileImage).catch(() => {});
    }

    const uploadResult = await S3UploadHelper.uploadFile(req.file, "student-profiles");
    if (uploadResult?.key) updates.profileImage = uploadResult.key;
  }

  const student = await Student.findByIdAndUpdate(studentId, updates, { new: true });
  if (!student) throw new ApiError(404, "Student not found");

  const studentObj = student.toObject();
  if (studentObj.profileImage) {
    studentObj.profileImageUrl = await S3UploadHelper.getSignedUrl(studentObj.profileImage).catch(() => null);
  }

  return res.status(200).json(new ApiResponse(200, studentObj, "Student updated successfully"));
});

// =================== Update Profile Image ===================
export const updateStudentProfileImage = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  if (!req.file) throw new ApiError(400, "Profile image file is required");

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (student.profileImage) {
    await S3UploadHelper.deleteFile(student.profileImage).catch(() => {});
  }

  const uploadResult = await S3UploadHelper.uploadFile(req.file, "student-profiles");
  student.profileImage = uploadResult.key;
  await student.save();

  const profileImageUrl = await S3UploadHelper.getSignedUrl(uploadResult.key);

  return res
    .status(200)
    .json(new ApiResponse(200, { profileImageUrl }, "Profile image updated successfully"));
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
