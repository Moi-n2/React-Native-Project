import express from "express";
import upload from "../middleware/multer.js";
import {
  signUp,
  activateUser,
  login,
  logout,
  getUserInfo,
  updateUserName,
  updatePassword,
  updateAvatar,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller.js";
import { authorizeRoles, isAutheticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/me", isAutheticated, getUserInfo);
userRouter.put("/update-user-name", isAutheticated, updateUserName);
userRouter.put("/update-user-password", isAutheticated, updatePassword);
userRouter.put(
  "/update-user-avatar",
  isAutheticated,
  upload.single("avatar"),
  updateAvatar
);

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
  "/delte-user/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
