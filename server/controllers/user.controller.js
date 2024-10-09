import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

import userModel from "../models/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendMail from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import { redis } from "../utils/redis.js";
import { getAllUsersService, getUserById } from "../service/user.service.js";

export const signUp = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      console.log("isEmailExist:", isEmailExist);

      return next(new ErrorHandler("email already used", 400));
    }

    const user = { name, email, password };

    const { token, activationCode } = createActivatedToken(user);
    const data = { user: { name }, activationCode };

    await sendMail({
      email,
      subject: "Activate your account",
      template: "activation-mail.ejs",
      data,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${email} to activate your account!`,
      activationToken: token,
    });
  } catch (error) {
    console.log(error);

    return next(new ErrorHandler(error.message, 400));
  }
});

const createActivatedToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign({ user, activationCode }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  return { token, activationCode };
};

export const activateUser = catchAsyncError(async (req, res, next) => {
  try {
    const { activation_token, activation_code } = req.body;
    const { user, activationCode } = jwt.verify(
      activation_token,
      process.env.JWT_SECRET
    );
    if (activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = user;

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("Email already used", 400));
    }

    const newUser = await userModel.create({
      name,
      email,
      password,
      isVerified: true,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("please enter email and password", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const logout = catchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("fresh_token", "", { maxAge: 1 });

    const userId = req.user._id || "";
    redis.del(userId);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateAccessToken = catchAsyncError(async (req, res, next) => {
  try {
    const fresh_token = req.headers["fresh-token"];
    const decoded = jwt.verify(fresh_token, JWT_SECRET);

    const message = "could not refresh token";

    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }

    const session = await redis.get(decoded.id);

    if (!session) {
      return next(new ErrorHandler("please login to refresh token", 400));
    }

    const user = JSON.parse(session);

    req.user = user;

    await redis.set(user._id, JSON.stringify(user), "EX", 7 * 24 * 60 * 60);

    return next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getUserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.userId;
    getUserById(userId, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateUserName = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("UnAuthorized, try login first"), 400);
    }
    const name = req.body.userName;
    if (!name) {
      return next(new ErrorHandler("userName can not be empty"), 400);
    }

    user.name = name;
    await user.save();
    await redis.set(userId, JSON.stringify(user));

    res.status(201).json({
      succes: true,
      data: user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  try {
    const { oldPassword, newPassword, userId } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("please enter old and new password"));
    }

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      return next(new ErrorHandler("UnAuthorized, try login first"), 400);
    }

    if (user?.password === undefined) {
      return next(new ErrorHandler("Invalid user", 400));
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = newPassword;

    await user.save();

    await redis.set(userId, JSON.stringify(user));

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateAvatar = catchAsyncError(async (req, res, next) => {
  try {
    const { userId } = req.body;
    const avatar = req.file.avatar;

    const user = await userModel.findById(userId);
    if (user && avatar) {
      if (user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const avatarCloud = await cloudinary.uploader.upload(avatar.path, {
        resource_type: "image",
        folder: "avatars",
        width: 150,
      });

      user.avatar = {
        public_id: avatarCloud.public_id,
        url: avatarCloud.secure_url,
      };

      await user.save();
      await redis.set(userId, JSON.stringify(user));
      res.status(200).json({
        succes: true,
        data: user,
      });
    } else {
      next(new ErrorHandler("Update avatar failed,try again", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  try {
    getAllUsersService();
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
      const id = isUserExist._id;
      const user = await userModel.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      );
      res.status(201).json({
        success: true,
        data: user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
export const deleteUser = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.deleteOne({ id });

    await redis.del(id);

    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    res.status(200).json({
      succes: true,
      message: "User deleted Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
