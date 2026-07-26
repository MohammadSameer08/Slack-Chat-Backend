import userModel from "../models/user.model.js";
import { ApiError } from "../error/error.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    const authToken = newUser.generateAuthToken();
    const refreshToken = newUser.generateRefreshToken();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    newUser.refreshToken = hashedRefreshToken;
    await newUser.save();

    // eslint-disable-next-line no-unused-vars
    const { password: _, refreshToken: __, ...safeUser } = newUser.toObject();

    res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "User registered successfully",
        data: safeUser,
        accessToken: authToken,
      });
  } catch (error) {
    throw new ApiError(500, error.message || "Internal Server Error");
  }
};
