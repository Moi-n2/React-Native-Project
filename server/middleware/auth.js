import { updateAccessToken } from "../controllers/user.controller.js";
import CatchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis.js";

export const isAutheticated = CatchAsyncError(async (req, res, next) => {
  const access_token = req.headers["access-token"];

  if (!access_token) {
    return next(new ErrorHandler("Unauthorized, please login in first", 400));
  }

  const decoded = jwt.decode(access_token);

  if (!decoded) {
    return next(new ErrorHandler("Unauthorized, please login in first", 400));
  }

  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try {
      updateAccessToken(req, res, next);
    } catch (error) {
      return next(error);
    }
  } else {
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Unauthorized, please login in first", 400));
    }

    req.user = JSON.parse(user);

    next();
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role || "")) {
      return next(
        new ErrorHandler("Unauthorized,only admin user can operate", 403)
      );
    }
  };
};
