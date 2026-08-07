import Workspace from "../models/workspace.model.js";

export const createWorkspace = async (workspaceData) => {
  const workspace = new Workspace(workspaceData);
  return await workspace.save();
};

export const getWorkspacesByUserId = async (userId) => {
  return await Workspace.find({ "members.user": userId });
};

export const getWorkspaceById = async (workspaceId) => {
  return await Workspace.findById(workspaceId)
    .populate("owner", "username email")
    .populate("members.user", "username email");
};

export const updateWorkspace = async (workspace) => {
  return await workspace.save();
};
