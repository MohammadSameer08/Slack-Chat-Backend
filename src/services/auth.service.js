import * as userRepository from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateTokens } from "../utils/tokenGenerator.js";
import { ConflictError, UnauthorizedError } from "../error/error.js";

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
