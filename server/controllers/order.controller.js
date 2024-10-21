import { redis } from "../utils/redis.js";
import catchAsyncError from "../utils/catchAsyncError.js";

import Stripe from "stripe";
import ErrorHandler from "../utils/ErrorHandler.js";
import userModel from "../models/user.model.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const currency = "usd";
const deliveryCharge = 10;
// new payment
export const newPayment = catchAsyncError(async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const amountInCents = Math.round(amount * 100);

    const myPayment = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
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
    const { status, address } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("UnAuthorized, try login first"), 400);
    }

    const data = {
      cart: user?.cart,
      status,
      address,
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

export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("UnAuthorized, try login first"), 400);
    }
    const { origin } = req.headers;

    const line_items = user?.cart.map((item, index) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });
    // 获取协议（http 或 https）
    const protocol = req.protocol;

    // 获取主机名（包括端口）
    const host = req.get("host");

    // 组合成完整的 URL
    const fullUrl = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      success_url: `${fullUrl}/verify?success=true`,
      cancel_url: `${fullUrl}/verify?success=false`,
      line_items,
      mode: "payment",
    });

    res.status(200).json({
      success: true,
      data: {
        session_url: session.url,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//verify stripe
export const verifyStripe = async (req, res) => {
  const userId = req.user?._id;
  const { success, address } = req.body;

  try {
    if (success === "true") {
      const user = await userModel.findById(userId);
      const data = {
        cart: user?.cart,
        status: "Paid by Stripe",
        address,
      };
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { cart: [], orders: [...user.orders, data] },
        { new: true }
      );
      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "Paid by Stripe successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment failed, order has been canceled!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
