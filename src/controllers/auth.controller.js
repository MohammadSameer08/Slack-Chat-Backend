import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.registerUser(
    username,
    email,
    password,
  );

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;

  res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json({
      success: true,
      message: "User registered successfully",
      data: safeUser,
    });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password,
  );

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;

  res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json({
      success: true,
      message: "User logged in successfully",
      data: safeUser,
    });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken, newRefreshToken } =
    await authService.refreshToken(refreshToken);

  res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions)
    .json({
      success: true,
      message: "Token refreshed successfully",
    });
});
