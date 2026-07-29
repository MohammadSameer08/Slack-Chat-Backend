import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || "member",
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
