export const getAccessToken = (req) => {
  return req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
};

export const getRefreshToken = (req) => {
  return req.cookies.refreshToken;
};
