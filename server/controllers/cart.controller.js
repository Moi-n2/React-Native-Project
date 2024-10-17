import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import { redis } from "../utils/redis.js";

const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, quantity, size } = req.body;
    const productId = product._id;
    const user = await userModel.findById(userId);
    let cartData = user.cart.slice();
    const idx = cartData.findIndex(
      (item) => item.product._id?.equals(productId) && item.size === size
    );

    if (idx !== -1) {
      if (quantity) {
        cartData[idx].quantity = quantity;
      } else {
        if (quantity === undefined) {
          cartData[idx].quantity++;
        }
        if (quantity === 0) {
          cartData.splice(idx, 1);
        }
      }
    } else {
      cartData.push({
        _id: new mongoose.Types.ObjectId(), // 生成新的 _id,
        product,
        quantity: 1,
        size,
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { cart: cartData },
      { new: true }
    );

    redis.set(userId, JSON.stringify(updatedUser), "EX", 7 * 24 * 60 * 60);

    res.status(200).json({
      message: "Update cart successfully!",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { updateCart };
