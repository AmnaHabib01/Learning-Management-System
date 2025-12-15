// src/core/middleware/adminTokenInterceptor.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import Admin from "../../models/Admin.model.js";
import { ApiError } from "../utils/api-error.js";
import { storeAccessToken } from "../../shared/helpers/cookies.helper.js";

// Global middleware for all admin routes
const adminTokenInterceptor = asyncHandler(async (req, res, next) => {
  const adminAccessToken = req.cookies?.adminAccessToken;
  const adminRefreshToken = req.cookies?.adminRefreshToken;

  try {
    if (!adminAccessToken) {
      if (!adminRefreshToken) throw new ApiError(401, "Admin not authenticated");

      // Check refresh token
      const admin = await Admin.findOne({ adminRefreshToken });
      if (!admin) throw new ApiError(401, "Invalid refresh token");

      // Generate new access token
      const newAccessToken = admin.generateAccessToken();
      await storeAccessToken(res, newAccessToken, "admin");
      req.user = admin;
      return next();
    }

    // Verify access token
    try {
      const decoded = jwt.verify(adminAccessToken, process.env.ACCESS_TOKEN_SECRET);
      const admin = await Admin.findById(decoded._id).select("-password -adminRefreshToken");
      if (!admin) throw new ApiError(401, "Admin not found");
      req.user = admin;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        if (!adminRefreshToken) throw new ApiError(401, "Admin not authenticated");

        const admin = await Admin.findOne({ adminRefreshToken });
        if (!admin) throw new ApiError(401, "Invalid refresh token");

        const newAccessToken = admin.generateAccessToken();
        await storeAccessToken(res, newAccessToken, "admin");
        req.user = admin;
        return next();
      } else {
        throw new ApiError(401, "Invalid access token");
      }
    }
  } catch (error) {
    return next(error);
  }
});

export default adminTokenInterceptor;
