import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name."],
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
      minlength: [6, "password must be as least 6 characters"],
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

userSchema.methods.accessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "", {
    expiresIn: "30m",
  });
};

userSchema.methods.freshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "", {
    expiresIn: "15d",
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
