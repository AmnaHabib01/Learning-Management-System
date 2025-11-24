import mongoose from "mongoose";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { asyncHandler } from "../../core/utils/async-handler.js";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";
import Student from "../../models/Student.model.js";
import { studentValidatorSchemas } from "../../shared/validators/student.validator.js";
import mailTransporter from "../../shared/config/mailTransporter.js";
import { studentVerificationMailBody } from "../../shared/mails/studentVerificationMail.js";

// =================== Get Student profile ===================
export const getStudentProfile = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const studentObj = student.toObject();
  if (studentObj.studentProfileImage) {
    studentObj.studentProfileImageUrl = await S3UploadHelper.getSignedUrl(
      studentObj.studentProfileImage
    ).catch(() => null);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, studentObj, "Student profile retrieved successfully"));
});

// =================== Update Student ===================
export const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const parsedData = studentValidatorSchemas.updateStudentSchema.safeParse(req.body);
  if (!parsedData.success) {
    const errors = parsedData.error.errors.map((e) => e.message);
    throw new ApiError(400, "Validation failed", errors);
  }

  const allowedFields = ["studentName", "studentPhoneNumber", "studentAddress"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (parsedData.data[field] !== undefined) updates[field] = parsedData.data[field];
  });

  if (req.file) {
    const oldStudent = await Student.findById(studentId);
    if (!oldStudent) throw new ApiError(404, "Student not found");

    if (oldStudent.studentProfileImage) {
      await S3UploadHelper.deleteFile(oldStudent.studentProfileImage).catch(() => {});
    }

    const uploadResult = await S3UploadHelper.uploadFile(req.file, "student-profiles");
    if (uploadResult?.key) updates.studentProfileImage = uploadResult.key;
  }

  const student = await Student.findByIdAndUpdate(studentId, updates, { new: true });
  if (!student) throw new ApiError(404, "Student not found");

  const studentObj = student.toObject();
  if (studentObj.studentProfileImage) {
    studentObj.studentProfileImageUrl = await S3UploadHelper.getSignedUrl(
      studentObj.studentProfileImage
    ).catch(() => null);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, studentObj, "Student updated successfully"));
});

// =================== Update Profile Image ===================
export const updateStudentProfileImage = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  if (!req.file) throw new ApiError(400, "Profile image file is required");

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (student.studentProfileImage) {
    await S3UploadHelper.deleteFile(student.studentProfileImage).catch(() => {});
  }

  const uploadResult = await S3UploadHelper.uploadFile(req.file, "student-profiles");
  student.studentProfileImage = uploadResult.key;
  await student.save();

  const profileImageUrl = await S3UploadHelper.getSignedUrl(uploadResult.key);

  return res
    .status(200)
    .json(new ApiResponse(200, { studentProfileImageUrl: profileImageUrl }, "Profile image updated successfully"));
});

// =================== Delete Profile Image ===================
export const deleteStudentProfileImage = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");
  if (!student.studentProfileImage) throw new ApiError(400, "Student does not have a profile image");

  await S3UploadHelper.deleteFile(student.studentProfileImage);
  student.studentProfileImage = null;
  await student.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Profile image deleted successfully"));
});

