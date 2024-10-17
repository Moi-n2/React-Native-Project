import { Router } from "express";
import {
  addProduct,
  getProductById,
  listProduct,
} from "../controllers/product.controller.js";
import upload from "../middleware/multer.js";

const productRouter = Router();

productRouter.get("/", listProduct);
productRouter.get("/:id", getProductById);

productRouter.post(
  "/add",
  // adminAuth,
  upload.fields([{ name: "images", maxCount: 4 }]),
  addProduct
);

export default productRouter;
