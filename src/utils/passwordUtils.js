import bcrypt from "bcrypt";
import crypto from "crypto";
import { generatePasswordResetToken } from "./tokenGenerator.js";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateAndHashResetToken = (user) => {
  const plainToken = generatePasswordResetToken(user);
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainToken)
    .digest("hex");
  return { plainToken, hashedToken };
};
