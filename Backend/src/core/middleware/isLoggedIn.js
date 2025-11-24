import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

const isLoggedIn = asyncHandler(async (req, res, next) => {
  // Check for role-specific tokens
  const adminToken = req.cookies.adminAccessToken;
  const teacherToken = req.cookies.teacherAccessToken;
  const studentToken = req.cookies.studentAccessToken;

  let accessToken;
  let role;

  if (adminToken) {
    accessToken = adminToken;
    role = "admin";
  } else if (teacherToken) {
    accessToken = teacherToken;
    role = "teacher";
  } else if (studentToken) {
    accessToken = studentToken;
    role = "student";
  }

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized — no access token found");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    req.userRole = role; // Attach role to request
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    throw new ApiError(401, "Invalid or expired token");
  }
});

export { isLoggedIn };
