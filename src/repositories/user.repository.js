import userModel from "../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

export const findUserByEmailWithPassword = async (email) => {
  return await userModel.findOne({ email }).select("+password");
};

export const createUser = async (userData) => {
  const user = new userModel(userData);
  return await user.save();
};

export const updateUser = async (userId, updateData) => {
  return await userModel.findByIdAndUpdate(userId, updateData, { new: true });
};

export const findUserById = async (userId) => {
  return await userModel.findById(userId);
};

export const findUserByRefreshToken = async (refreshToken) => {
  return await userModel.findOne({ refreshToken });
};
