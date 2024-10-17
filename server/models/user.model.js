import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import { productSchema } from "./product.model.js";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const orderSchema = new mongoose.Schema(
  {
    cart: [
      {
        product: {
          type: productSchema,
        },
        quantity: {
          type: Number,
          min: 1, // 至少为1
        },
        size: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } } // 添加时间戳
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter your firstName."],
    },
    lastName: {
      type: String,
      required: [true, "please enter your lastName."],
    },
    email: {
      type: String,
      requires: [true, "please enter your email"],
      validate: {
        validator: function (val) {
          return emailRegexPattern.test(val);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "password must be as least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    products: {
      type: [
        {
          productId: {
            // 引用 Product 的 ID
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
          },
        },
      ],
    },
    cart: {
      type: [
        {
          product: {
            type: productSchema,
          },
          quantity: {
            // 添加数量字段
            type: Number,
            min: 1, // 至少为1
          },
          size: {
            // 添加尺码字段
            type: String,
          },
        },
      ],
      default: [], // 默认值为空数组
    },

    address: {
      type: [
        {
          firstName: String,
          lastName: String,
          phone: String,
          street: String,
          city: String,
          state: String,
          country: String,
          zipCode: String,
          isDefault: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    orders: {
      type: [orderSchema],
      default: [],
    },

    access_token: String,
    refresh_token: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "", {
    expiresIn: "30m",
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "", {
    expiresIn: "7d",
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
