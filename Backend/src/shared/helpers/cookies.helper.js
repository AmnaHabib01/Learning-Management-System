import { asyncHandler } from "../../core/utils/async-handler.js";

const isProduction = process.env.NODE_ENV === "production";

// Store both access & refresh token cookies for a specific role
const storeLoginCookies = (res, accessToken, refreshToken, role) => {
    if (!role) throw new Error("Role must be specified for cookies");

    const normalizedRole = role.toLowerCase();
    const accessTokenName = `${normalizedRole}AccessToken`;
    const refreshTokenName = `${normalizedRole}RefreshToken`;

    // Access Token Cookie (short-lived)
    res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Refresh Token Cookie (long-lived)
    res.cookie(refreshTokenName, refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

// Store only access token cookie for a specific role
const storeAccessToken = (res, accessToken, role) => {
    if (!role) throw new Error("Role must be specified for cookie");

    const normalizedRole = role.toLowerCase();
    const accessTokenName = `${normalizedRole}AccessToken`;

    res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
}

export { storeLoginCookies, storeAccessToken };
