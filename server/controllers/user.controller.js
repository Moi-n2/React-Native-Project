import "dotenv/config";
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
    const { firstName, lastName, email, password } = req.body;

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      console.log("isEmailExist:", isEmailExist);

      return next(new ErrorHandler("email already used", 400));
    }

    const user = { firstName, lastName, email, password };

    const { token, activationCode } = createActivatedToken(user);
    const name = firstName + " " + lastName;
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
      data: {
        activationToken: token,
      },
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

    const { firstName, lastName, email, password } = user;

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("Email already used", 400));
    }

    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password,
      isVerified: true,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Your account is activated successfully!",
    });
  } catch (error) {
    console.log("error:", error);

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
    console.log(error);

    return next(new ErrorHandler(error.message, 400));
  }
});

export const logout = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._Id || "";
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
    let refresh_token = req.headers["refresh-token"];
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

    const message = "Token expired, please log in";

    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler(message, 400));
    }

    const access_token = user.generateAccessToken();
    refresh_token = user.generateRefreshToken();

    const refreshedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        access_token,
        refresh_token,
      },
      { new: true }
    );

    req.user = refreshedUser;

    await redis.set(
      user._id,
      JSON.stringify(refreshedUser),
      "EX",
      7 * 24 * 60 * 60
    );

    return next();
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getUserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    getUserById(userId, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateUserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("UnAuthorized, try login first"), 400);
    }
    const { firstName, lastName, email } = req.body;

    if (!lastName || !firstName || !email) {
      return next(new ErrorHandler("Name/Email can not be empty"), 400);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
      },
      { new: true }
    );

    await redis.set(
      userId,
      JSON.stringify(updatedUser),
      "EX",
      7 * 24 * 60 * 60
    );

    res.status(201).json({
      success: true,
      message: "Update user info successfully!",
      data: updatedUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

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

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updateAvatar = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    const user = await userModel.findById(userId);
    if (user && avatar) {
      if (user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const avatarCloud = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });

      const userAvatar = {
        public_id: avatarCloud.public_id,
        url: avatarCloud.secure_url,
      };

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {
          avatar: userAvatar,
        },
        { new: true }
      );
      await redis.set(
        userId,
        JSON.stringify(updatedUser),
        "EX",
        7 * 24 * 60 * 60
      );
      res.status(200).json({
        success: true,
        message: "Change avatar successfully!",
        data: updatedUser,
      });
    } else {
      next(new ErrorHandler("Update avatar failed,try again", 400));
    }
  } catch (error) {
    console.log(error);

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

export const updateUserAddress = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("UnAuthorized, try login first"), 400);
    }
    const address = req.body;

    if (!address) {
      return next(new ErrorHandler("address can not be empty"), 400);
    }

    let addressList = user.address;

    if (address.isDefault) {
      addressList.forEach((item) => {
        item.isDefault = false;
      });
    }

    if (address._id) {
      addressList = addressList.map((item) => {
        if (item._id.equals(address._id)) {
          return address;
        } else {
          return item;
        }
      });

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {
          address: addressList,
        },
        { new: true }
      );

      await redis.set(userId, JSON.stringify(updatedUser));

      return res.status(201).json({
        success: true,
        message: "Update user address successfully!",
        data: updatedUser,
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        address: [...addressList, address],
      },
      { new: true }
    );

    await redis.set(userId, JSON.stringify(updatedUser));

    res.status(201).json({
      success: true,
      message: "Update user address successfully!",
      data: updatedUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
