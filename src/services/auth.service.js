import * as userRepository from "../repositories/user.repository.js";
import {
  hashPassword,
  comparePassword,
  generateAndHashResetToken,
} from "../utils/passwordUtils.js";
import { generateTokens } from "../utils/tokenGenerator.js";
import { ConflictError, UnauthorizedError } from "../error/error.js";
import crypto from "crypto";

export const registerUser = async (username, email, password) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);
  const { accessToken, refreshToken } = generateTokens({ _id: null, email });
  const hashedRefreshToken = await hashPassword(refreshToken);

  const newUser = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
    refreshToken: hashedRefreshToken,
  });

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email, password) => {
  const user = await userRepository.findUserByEmailWithPassword(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user);
  const hashedRefreshToken = await hashPassword(refreshToken);

  await userRepository.updateUser(user._id, {
    refreshToken: hashedRefreshToken,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (refreshToken) => {
  const user = await userRepository.findUserByRefreshToken(refreshToken);
  if (!user) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
  const hashedRefreshToken = await hashPassword(newRefreshToken);

  await userRepository.updateUser(user._id, {
    refreshToken: hashedRefreshToken,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await userRepository.findUserByIdSafe(userId);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }
  return user;
};

export const forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const { plainToken, hashedToken } = generateAndHashResetToken(user);
  const expiryTime = new Date(Date.now() + 3600000); // 1 hour from now

  await userRepository.updateUser(user._id, {
    passwordResetToken: hashedToken,
    passwordResetTokenExpiry: expiryTime,
  });

  console.log(`Password reset token for ${email}: ${plainToken}`);
  console.log(`http://localhost:3000/api/auth/reset-password/${plainToken}`);
  
  return plainToken;
};

export const resetPassword = async (resetToken, newPassword) => {
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await userRepository.findUserByResetToken(hashedResetToken);

  if (!user) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const hashedPassword = await hashPassword(newPassword);

  await userRepository.updateUser(user._id, {
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetTokenExpiry: null,
  });

  return true;
};
