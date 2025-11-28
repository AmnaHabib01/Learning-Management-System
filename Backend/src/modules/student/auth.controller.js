import { asyncHandler } from "../../core/utils/async-handler.js";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";
import Student from "../../models/Student.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { userForgotPasswordMailBody, userVerificationMailBody } from "../../shared/constants/mail.constant.js";
import { mailTransporter } from "../../shared/helpers/mail.helper.js";
import { storeAccessToken, storeLoginCookies } from "../../shared/helpers/cookies.helper.js";
import crypto from "crypto";

// --- Register Student ---
const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;
 if (!email) throw new ApiError(400, "Email is required");
  const existingStudent = await Student.findOne({ email });
  if (existingStudent) throw new ApiError(400, "Student already exists");

  let profileImageKey = null;
  let signedUrl = null;

  if (req.file) {
    try {
      const uploadResult = await S3UploadHelper.uploadFile(req.file, "student-profiles");
      if (uploadResult?.key) {
        profileImageKey = uploadResult.key;
        signedUrl = await S3UploadHelper.getSignedUrl(uploadResult.key);
      }
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new ApiError(500, "Profile image upload failed");
    }
  }

  const student = await Student.create({
    name,
    email,
    password,
    phoneNumber,
    address,
    ...(profileImageKey && { profileImage: profileImageKey }),
  });

  if (!student) throw new ApiError(400, "Student not created");

  // Generate email verification token
  const { hashedToken, tokenExpiry } = student.generateTemporaryToken();
  student.studentVerificationToken = hashedToken;
  student.studentVerificationTokenExpiry = tokenExpiry;
  await student.save();

  const verificationLink = `${process.env.BASE_URL}/api/v1/auth/verify/${hashedToken}`;
  await mailTransporter.sendMail({
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: email,
    subject: "Verify your email",
    html: userVerificationMailBody(name, verificationLink),
  });

  const response = {
    studentId: student._id,
    studentName: student.name,
    studentEmail: student.email,
    studentPhoneNumber: student.phoneNumber,
    studentAddress: student.address,
    ...(signedUrl && { studentProfileImageUrl: signedUrl }),
  };

  return res.status(201).json(new ApiResponse(201, response, "Student created successfully"));
});

// --- Login Student ---
const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) throw new ApiError(400, "Student not found");

  const isPasswordCorrect = await student.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

  if (!student.studentIsVerified) throw new ApiError(400, "Student not verified");

  const accessToken = student.generateAccessToken();
  const refreshToken = student.generateRefreshToken();

  storeLoginCookies(res, accessToken, refreshToken, "student");

  student.studentRefreshToken = refreshToken;
  await student.save();

  let signedProfileImageUrl = null;
  if (student.profileImage) {
    try {
      signedProfileImageUrl = await S3UploadHelper.getSignedUrl(student.profileImage);
    } catch (err) {
      console.error("Error generating signed URL:", err);
    }
  }

  const response = {
    student: {
      studentId: student._id,
      studentName: student.name,
      studentEmail: student.email,
      studentPhoneNumber: student.phoneNumber,
      studentAddress: student.address,
      studentProfileImage: signedProfileImageUrl || null,
    },
    tokens: { accessToken, refreshToken },
  };

  return res.status(200).json(new ApiResponse(200, response, "Student logged in successfully"));
});

// --- Logout Student ---
const logoutStudent = asyncHandler(async (req, res) => {
  const studentId = req.user?._id;
  if (!studentId) throw new ApiError(401, "Student not authenticated");

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  student.studentRefreshToken = null;
  await student.save();

  res.clearCookie("studentAccessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
  res.clearCookie("studentRefreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });

  return res.status(200).json(new ApiResponse(200, {}, "Student logged out successfully"));
});

// --- Verify Student Email ---
const verifyStudentEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) throw new ApiError(400, "Token not found");

  const student = await Student.findOne({
    studentVerificationToken: token,
    studentVerificationTokenExpiry: { $gt: Date.now() },
  });
  if (!student) throw new ApiError(400, "Invalid or expired verification token");

  student.studentIsVerified = true;
  student.studentVerificationToken = null;
  student.studentVerificationTokenExpiry = null;
  await student.save();

  return res.status(200).json(new ApiResponse(200, {}, "Student verified successfully"));
});

// --- Refresh Access Token ---
const getAccessToken = asyncHandler(async (req, res) => {
  const { studentRefreshToken } = req.cookies;
  if (!studentRefreshToken) throw new ApiError(400, "Refresh token not found");

  const student = await Student.findOne({ studentRefreshToken });
  if (!student) throw new ApiError(400, "Invalid refresh token");

  const accessToken = student.generateAccessToken();
  storeAccessToken(res, accessToken, "student");

  return res.status(200).json(new ApiResponse(200, { accessToken }, "Access token generated successfully"));
});

// --- Forgot Password ---
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const student = await Student.findOne({ email });
  if (!student) throw new ApiError(400, "Student not found");

  const { hashedToken, tokenExpiry } = student.generateTemporaryToken();
  student.studentPasswordResetToken = hashedToken;
  student.studentPasswordExpirationDate = tokenExpiry;
  await student.save();

  // const resetLink = `${process.env.BASE_URL}/api/v1/student/reset-password/${hashedToken}`;
   const resetLink = `${process.env.FRONTEND_URL}/reset-password/student/${hashedToken}`;
  await mailTransporter.sendMail({
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: email,
    subject: "Password Reset",
    html: userForgotPasswordMailBody(student.name, resetLink),
  });

  return res.status(200).json(new ApiResponse(200, { resetLink }, "Password reset link sent successfully"));
});

// --- Reset Password ---
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const student = await Student.findOne({
    studentPasswordResetToken: token,
    studentPasswordExpirationDate: { $gt: Date.now() },
  });
  if (!student) throw new ApiError(400, "Invalid or expired password reset token");

  student.password = password;
  student.studentPasswordResetToken = null;
  student.studentPasswordExpirationDate = null;
  await student.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
  registerStudent,
  loginStudent,
  logoutStudent,
  verifyStudentEmail,
  getAccessToken,
  forgotPassword,
  resetPassword
};
