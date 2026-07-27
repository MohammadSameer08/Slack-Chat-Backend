import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
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

  res.status(201).cookie("refreshToken", refreshToken, cookieOptions).json({
    success: true,
    message: "User registered successfully",
    data: safeUser,
    accessToken,
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

  res.status(200).cookie("refreshToken", refreshToken, cookieOptions).json({
    success: true,
    message: "User logged in successfully",
    data: safeUser,
    accessToken,
  });
});
