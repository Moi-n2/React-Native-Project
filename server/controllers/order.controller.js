import { redis } from "../utils/redis.js";
import catchAsyncError from "../utils/catchAsyncError.js";

import Stripe from "stripe";
import ErrorHandler from "../utils/ErrorHandler.js";
import userModel from "../models/user.model.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// new payment
export const newPayment = catchAsyncError(async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const amountInCents = Math.round(amount * 100);

    const myPayment = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        company: "Forever",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        client_secret: myPayment.client_secret,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
export const createMobileOrder = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { status,address } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("UnAuthorized, try login first"), 400);
    }

    const data = {
      cart: user?.cart,
      status,
      address
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { cart: [], orders: [...user.orders, data] },
      { new: true }
    );

    redis.set(userId, JSON.stringify(updatedUser), "EX", 7 * 24 * 60 * 60);

    res.status(200).json({
      message: "Order placed successfully!",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
