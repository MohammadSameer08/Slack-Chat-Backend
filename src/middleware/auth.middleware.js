import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { UnauthorizedError } from "../error/error.js";
import { getAccessToken } from "../utils/tokenExtractor.js";

const validateUser = asyncHandler(async (req, res, next) => {
  const token = getAccessToken(req);

  if (!token) {
    throw new UnauthorizedError("Authentication required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    throw new UnauthorizedError("Invalid or expired token");
  }
});

export default validateUser;
