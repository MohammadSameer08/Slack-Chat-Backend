import * as workspaceRepository from "../repositories/workspace.repository.js";
import { WORKSPACE_ROLES } from "../constants/workspace.constants.js";

export const createWorkspace = async (userId, workspaceData) => {
  // Build the workspace object with business logic
  const workspace = {
    name: workspaceData.name,
    description: workspaceData.description || "",
    owner: userId,
    members: [
      {
        user: userId,
        role: WORKSPACE_ROLES.OWNER,
        joinedAt: new Date(),
      },
    ],
  };

  // Save to database via repository
  return await workspaceRepository.createWorkspace(workspace);
};
