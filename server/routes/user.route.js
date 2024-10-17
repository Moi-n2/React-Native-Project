import express from "express";
import {
  signUp,
  activateUser,
  login,
  logout,
  getUserInfo,
  updateUserInfo,
  updatePassword,
  updateAvatar,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserAddress,
} from "../controllers/user.controller.js";
import { authorizeRoles, isAutheticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", login);
userRouter.get("/logout", isAutheticated, logout);
userRouter.get("/me", isAutheticated, getUserInfo);
userRouter.put("/update-user-info", isAutheticated, updateUserInfo);
userRouter.put("/update-user-password", isAutheticated, updatePassword);
userRouter.put("/update-user-avatar", isAutheticated, updateAvatar);
userRouter.post("/update-user-address", isAutheticated, updateUserAddress);

userRouter.get(
  "/get-users",
  isAutheticated,
  authorizeRoles("admin"),
  getAllUsers
);
userRouter.put(
  "/update-role",
  isAutheticated,
  authorizeRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/delete-user/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
