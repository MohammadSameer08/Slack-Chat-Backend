import Workspace from "../models/workspace.model.js";
export const createWorkspace = async (workspaceData) => {
  const workspace = new Workspace(workspaceData);
  return await workspace.save();
};
