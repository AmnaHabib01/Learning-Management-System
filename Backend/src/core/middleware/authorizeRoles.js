import { ApiError } from "../utils/api-error.js";

/**
 * authorizeRoles(...)
 * Checks if the logged-in user or admin has any of the allowed roles.
 * Usage:
 *   authorizeRoles("store-admin")
 *   authorizeRoles("factory-admin", "super-admin")
 *   authorizeRoles("user", "admin")
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized - Please log in first");
    }

    const currentRole = req.user.role; // unified

    if (!currentRole) {
      throw new ApiError(403, "Access denied - No role assigned");
    }

    if (!allowedRoles.includes(currentRole)) {
      throw new ApiError(
        403,
        `Access denied - Only [${allowedRoles.join(", ")}] can access this route`
      );
    }

    next();
  };
};

export { authorizeRoles };