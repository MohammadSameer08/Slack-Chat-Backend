import Workspace from "../models/workspace.model.js";

export const createWorkspace = async (workspaceData) => {
  const workspace = new Workspace(workspaceData);
  return await workspace.save();
};

export const getWorkspacesByUserId = async (userId) => {
  return await Workspace.find({ "members.user": userId });
};

export const getWorkspaceById = async (workspaceId, userId) => {
  return await Workspace.findOne({ _id: workspaceId, "members.user": userId })
    .populate("owner", "username email")
    .populate("members.user", "username email");
};
