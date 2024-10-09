import { redis } from "./redis.js";

export const sendToken = (user, statusCode, res) => {
  const accessToken = user.accessToken();
  const freshToken = user.freshToken();

  redis.set(user._id, JSON.stringify(user));
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
    freshToken,
  });
};
