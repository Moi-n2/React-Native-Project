import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import productModel from "../models/product.model.js";
import { redis } from "../utils/redis.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const images = req.files.images;

    let imagesURL = await Promise.all(
      images.map(async (item) => {
        let res = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "products",
        });
        fs.unlink(item.path, (err) => {
          if (err) {
            throw err;
          }
        });
        return {
          public_id: res.public_id,
          url: res.secure_url,
        };
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesURL,
    };

    const product = new productModel(productData);
    await product.save();

    res.status(200).json({ message: "Add product successfully!" });
  } catch (error) {
    req.files.images.forEach((item) => {
      fs.unlink(item.path);
    });
    res.status(500).json({ message: error.message });
  }
};

const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const cacheProduct = redis.get(id);

    if (cacheProduct) {
      const product = JSON.parse(cacheProduct);
      return res.status(200).json({ data: product, success: true });
    }

    const product = await productModel.findById(id);
    await redis.set(id, JSON.stringify(product), "EX", 7 * 24 * 60 * 60);
    res.status(200).json({ data: product, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addProduct, getProductById, listProduct };
