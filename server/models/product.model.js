import mongoose from "mongoose";

export const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    image: Array,
    category: String,
    subCategory: String,
    sizes: Array,
    bestseller: Boolean,
  },
  {
    timestamps: true, // 启用时间戳
    minimize: false,
  }
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
