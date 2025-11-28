import { asyncHandler } from "../../core/utils/async-handler.js";
import Admin from "../../models/Admin.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";
import { userForgotPasswordMailBody, userVerificationMailBody } from "../../shared/constants/mail.constant.js";
import { mailTransporter } from "../../shared/helpers/mail.helper.js";
import { storeAccessToken, storeLoginCookies } from "../../shared/helpers/cookies.helper.js";
import crypto from "crypto";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";
import Teacher from "../../models/Teacher.model.js";
// ---------------- Register Admin ----------------
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) throw new ApiError(400, "Admin already exists");

    let profileImageKey = null;
    if (req.file) {
        try {
            const uploadResult = await S3UploadHelper.uploadFile(req.file, "admin-profiles");
            profileImageKey = uploadResult.key;
        } catch (error) {
            console.error("S3 Upload Error:", error);
            throw new ApiError(500, "Profile image upload failed");
        }
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        ...(profileImageKey && { profileImage: profileImageKey })
    });

    if (!admin) throw new ApiError(400, "Admin not created");

    const { unHashedToken, hashedToken, tokenExpiry } = admin.generateTemporaryToken();
    admin.adminVerificationToken = hashedToken;
    admin.adminVerificationTokenExpiry = tokenExpiry;
    await admin.save();

    const verificationLink = `${process.env.BASE_URL}/api/v1/admin/verify/${unHashedToken}`;
    await mailTransporter.sendMail({
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: email,
        subject: "Verify your email",
        html: userVerificationMailBody(name, verificationLink)
    });

    const response = {
        name: admin.name,
        email: admin.email,
        role: admin.role,
        ...(profileImageKey && { profileImage: profileImageKey })
    };

    return res.status(201).json(new ApiResponse(201, response, "Admin created successfully"));
});

// ---------------- Admin Login ----------------
const logInAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) throw new ApiError(400, "Admin not found");

    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

    if (!admin.adminIsVerified) throw new ApiError(400, "Admin not verified");

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    storeLoginCookies(res, accessToken, refreshToken, "admin");

    admin.adminRefreshToken = refreshToken;
    await admin.save();

    const response = {
        admin: {
            name: admin.name,
            email: admin.email,
            role: admin.role,
            profileImage: admin.profileImage || null
        },
        tokens: { accessToken, refreshToken }
    };

    return res.status(201).json(new ApiResponse(201, response, "Admin logged in successfully"));
});

// ---------------- Admin Logout ----------------
const logoutAdmin = asyncHandler(async (req, res) => {
    const adminId = req.user?._id;
    if (!adminId) throw new ApiError(401, "Admin not authenticated");

    const admin = await Admin.findById(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");

    admin.adminRefreshToken = null;
    await admin.save();

    res.clearCookie("adminAccessToken", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });
    res.clearCookie("adminRefreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });

    return res.status(200).json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

// ---------------- Verify Admin Email ----------------
const verifyAdminMail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) throw new ApiError(400, "Token not found");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
        adminVerificationToken: hashedToken,
        adminVerificationTokenExpiry: { $gt: Date.now() }
    });

    if (!admin) throw new ApiError(400, "Invalid or expired verification token");

    admin.adminIsVerified = true;
    admin.adminVerificationToken = null;
    admin.adminVerificationTokenExpiry = null;
    await admin.save();

    return res.status(200).json(new ApiResponse(200, {}, "Admin verified successfully"));
});

// ---------------- Get Admin Access Token ----------------
const getAdminAccessToken = asyncHandler(async (req, res) => {
    const { adminRefreshToken } = req.cookies;
    if (!adminRefreshToken) throw new ApiError(400, "Refresh token not found");

    const admin = await Admin.findOne({ adminRefreshToken });
    if (!admin) throw new ApiError(400, "Invalid refresh token");

    const accessToken = admin.generateAccessToken();
    await storeAccessToken(res, accessToken, "admin");

    return res.status(201).json(new ApiResponse(201, { accessToken }, "Admin access token generated successfully"));
});

// ---------------- Forgot Password ----------------
const forgotAdminPasswordMail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    console.log("Request email:", email);
    const admin = await Admin.findOne({ email });
    console.log("Found admin:", admin);
    if (!admin) throw new ApiError(400, "Admin not found");

    const { unHashedToken, hashedToken, tokenExpiry } = admin.generateTemporaryToken();
    admin.adminPasswordResetToken = hashedToken;
    admin.adminPasswordExpirationDate = tokenExpiry;
    await admin.save();

    // const resetLink = `${process.env.BASE_URL}/api/v1/admin/reset-password/${unHashedToken}`;
    // For admin
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/admin/${unHashedToken}`;

    await mailTransporter.sendMail({
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: email,
        subject: "Reset your password",
        html: userForgotPasswordMailBody(admin.name, resetLink)
    });

    return res.status(201).json(new ApiResponse(201, { resetLink }, "Password reset link sent successfully"));
});

// ---------------- Reset Password ----------------
const resetAdminPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
        adminPasswordResetToken: hashedToken,
        adminPasswordExpirationDate: { $gt: Date.now() }
    });

    if (!admin) throw new ApiError(400, "Invalid or expired password reset token");

    admin.password = password;
    admin.adminPasswordResetToken = null;
    admin.adminPasswordExpirationDate = null;
    await admin.save();

    return res.status(201).json(new ApiResponse(201, {}, "Password reset successfully"));
});

// ---------------- Get Admin Profile ----------------
const getAdminProfile = asyncHandler(async (req, res) => {
    const adminId = req.user?._id;
    const admin = await Admin.findById(adminId).select("-password -adminRefreshToken");
    if (!admin) throw new ApiError(404, "Admin not found");

    return res.status(200).json(new ApiResponse(200, admin, "Admin profile fetched successfully"));
});

// ---------------- Update Admin ----------------
const updateAdminProfile = asyncHandler(async (req, res) => {
    const adminId = req.user?._id;
    const { name, email } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");

    if (req.file) {
        try {
            const uploadResult = await S3UploadHelper.uploadFile(req.file, "admin-profiles");
            admin.profileImage = uploadResult.key;
        } catch (error) {
            console.error("S3 Upload Error:", error);
            throw new ApiError(500, "Profile image upload failed");
        }
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    await admin.save();
    return res.status(200).json(new ApiResponse(200, admin, "Admin profile updated successfully"));
});

// ---------------- Delete Admin ----------------
const deleteAdmin = asyncHandler(async (req, res) => {
    const adminId = req.user?._id;

    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) throw new ApiError(404, "Admin not found");

    return res.status(200).json(new ApiResponse(200, {}, "Admin deleted successfully"));
});
//---------------- Get All Teachers ----------------
const getAllTeachers = asyncHandler(async (req, res) => {
    if (req.userRole !== 'admin') {
        throw new ApiError(403, "Forbidden: Only admins can access all teachers");
    }
    const teachers = await Teacher.find().select("-password -teacherRefreshToken");
    return res.status(200).json(new ApiResponse(200, teachers, "All teachers fetched successfully"));
});
// ---------------- Delete Teacher ----------------
const deleteTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (req.userRole !== 'admin') {
        throw new ApiError(403, "Forbidden: Only admins can delete teachers");
    }
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) throw new ApiError(404, "Teacher not found");
    return res.status(200).json(new ApiResponse(200, {}, "Teacher deleted successfully"));
});

export {
    registerAdmin,
    logInAdmin,
    logoutAdmin,
    verifyAdminMail,
    getAdminAccessToken,
    forgotAdminPasswordMail,
    resetAdminPassword,
    getAdminProfile,
    updateAdminProfile,
    deleteAdmin,
    getAllTeachers,
    deleteTeacher
};
