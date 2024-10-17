import { redis } from "./redis.js";

export const sendToken = async (user, statusCode, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.access_token = accessToken;
  user.refresh_token = refreshToken;

  await user.save();

  redis.set(user._id, JSON.stringify(user), "EX", 7 * 24 * 60 * 60);
  res.status(statusCode).json({
    success: true,
    message: "Login successfully!",
    data: user,
  });
};
