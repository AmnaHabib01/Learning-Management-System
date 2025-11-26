import { asyncHandler } from "../../core/utils/async-handler.js";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { mailTransporter } from "../../shared/helpers/mail.helper.js";
import { userForgotPasswordMailBody, userVerificationMailBody } from "../../shared/constants/mail.constant.js";
import { storeAccessToken, storeLoginCookies } from "../../shared/helpers/cookies.helper.js";
import Teacher from "../../models/Teacher.model.js";

import crypto from "crypto";

// ---------------- Register Teacher ----------------
const registerTeacher = asyncHandler(async (req, res) => {
    const { name, email,password,phoneNumber, address } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) throw new ApiError(400, "Teacher already exists");

    let profileImageKey = null;
    if (req.file) {
        try {
            const uploadResult = await S3UploadHelper.uploadFile(req.file, "teacher-profiles");
            profileImageKey = uploadResult.key;
        } catch (error) {
            console.error("S3 Upload Error:", error);
            throw new ApiError(500, "Profile image upload failed");
        }
    }

    const teacher = await Teacher.create({
        name,
        email,
        password,
        phoneNumber,
        address,
        ...(profileImageKey && { profileImage: profileImageKey })
    });

    if (!teacher) throw new ApiError(400, "Teacher not created");

    const { unHashedToken, hashedToken, tokenExpiry } = teacher.generateTemporaryToken();

    teacher.teacherVerificationToken = hashedToken;
    teacher.teacherVerificationTokenExpiry = tokenExpiry;
    await teacher.save();

    const verificationLink = `${process.env.BASE_URL}/api/v1/teacher/verify/${unHashedToken}`;
    await mailTransporter.sendMail({
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: email,
        subject: "Verify your email",
        html: userVerificationMailBody(name, verificationLink)
    });

    const response = {
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        phoneNumber: teacher.phoneNumber,
        address: teacher.address,
        ...(profileImageKey && { profileImage: profileImageKey })
    };

    return res.status(201).json(new ApiResponse(201, response, "Teacher created successfully"));
});

// ---------------- Teacher Login ----------------
const logInTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) throw new ApiError(400, "Teacher not found");

    const isPasswordCorrect = await teacher.isPasswordCorrect(password);
    if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

    if (!teacher.teacherIsVerified) throw new ApiError(400, "Teacher not verified");

    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    storeLoginCookies(res, accessToken, refreshToken, "teacher");

    teacher.teacherRefreshToken = refreshToken;
    await teacher.save();

    const response = {
        teacher: {
            name: teacher.name,
            email: teacher.email,
            role: teacher.role,
            phoneNumber: teacher.phoneNumber,
            profileImage: teacher.profileImage || null
        },
        tokens: { accessToken, refreshToken }
    };

    return res.status(201).json(new ApiResponse(201, response, "Teacher logged in successfully"));
});

// ---------------- Teacher Logout ----------------
const logoutTeacher = asyncHandler(async (req, res) => {
    const teacherId = req.user?._id;
    if (!teacherId) throw new ApiError(401, "Teacher not authenticated");

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new ApiError(404, "Teacher not found");

    teacher.teacherRefreshToken = null;
    await teacher.save();

    res.clearCookie("teacherAccessToken", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });
    res.clearCookie("teacherRefreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });

    return res.status(200).json(new ApiResponse(200, {}, "Teacher logged out successfully"));
});

// ---------------- Verify Teacher Email ----------------
const verifyTeacherMail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) throw new ApiError(400, "Token not found");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const teacher = await Teacher.findOne({
        teacherVerificationToken: hashedToken,
        teacherVerificationTokenExpiry: { $gt: Date.now() }
    });

    if (!teacher) throw new ApiError(400, "Invalid or expired verification token");

    teacher.teacherIsVerified = true;
    teacher.teacherVerificationToken = null;
    teacher.teacherVerificationTokenExpiry = null;
    await teacher.save();

    return res.status(200).json(new ApiResponse(200, {}, "Teacher verified successfully"));
});

// ---------------- Get Access Token ----------------
const getTeacherAccessToken = asyncHandler(async (req, res) => {
    const { teacherRefreshToken } = req.cookies;
    if (!teacherRefreshToken) throw new ApiError(400, "Refresh token not found");

    const teacher = await Teacher.findOne({ teacherRefreshToken });
    if (!teacher) throw new ApiError(400, "Invalid refresh token");

    const accessToken = teacher.generateAccessToken();
    await storeAccessToken(res, accessToken, "teacher");

    return res.status(201).json(new ApiResponse(201, { accessToken }, "Teacher access token generated successfully"));
});

// ---------------- Forgot Password ----------------
const forgotTeacherPasswordMail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) throw new ApiError(400, "Teacher not found");

    const { unHashedToken, hashedToken, tokenExpiry } = teacher.generateTemporaryToken();
    teacher.teacherPasswordResetToken = hashedToken;
    teacher.teacherPasswordExpirationDate = tokenExpiry;
    await teacher.save();

    const resetLink = `${process.env.BASE_URL}/api/v1/teacher/reset-password/${unHashedToken}`;
    await mailTransporter.sendMail({
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: email,
        subject: "Reset your password",
        html: userForgotPasswordMailBody(teacher.name, resetLink)
    });

    return res.status(201).json(new ApiResponse(201, { resetLink }, "Password reset link sent successfully"));
});

// ---------------- Reset Password ----------------
const resetTeacherPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const teacher = await Teacher.findOne({
        teacherPasswordResetToken: hashedToken,
        teacherPasswordExpirationDate: { $gt: Date.now() }
    });

    if (!teacher) throw new ApiError(400, "Invalid or expired password reset token");

    teacher.password = password;
    teacher.teacherPasswordResetToken = null;
    teacher.teacherPasswordExpirationDate = null;
    await teacher.save();

    return res.status(201).json(new ApiResponse(201, {}, "Password reset successfully"));
});


// ---------------- Get Single Teacher ----------------
const getTeacherById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id).select("-password -teacherRefreshToken");
  if (!teacher) throw new ApiError(404, "Teacher not found");
  return res.status(200).json(new ApiResponse(200, teacher, "Teacher fetched successfully"));
});

// ---------------- Update Teacher ----------------
const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, address } = req.body;

  const teacher = await Teacher.findById(id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  if (req.file) {
    const uploadResult = await S3UploadHelper.uploadFile(req.file, "teacher-profiles");
    teacher.profileImage = uploadResult.key;
  }

  if (name) teacher.name = name;
  if (email) teacher.email = email;
  if (phoneNumber) teacher.phoneNumber = phoneNumber;
  if (address) teacher.address = address;

  await teacher.save();
  return res.status(200).json(new ApiResponse(200, teacher, "Teacher updated successfully"));
});



export {
  registerTeacher,
  logInTeacher,
  logoutTeacher,
  verifyTeacherMail,
  getTeacherAccessToken,
  forgotTeacherPasswordMail,
  resetTeacherPassword,
  getTeacherById,
  updateTeacher
};
