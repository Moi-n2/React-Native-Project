import { Router } from "express";
import { isAutheticated } from "../middleware/auth.js";
import {
  createMobileOrder,
  newPayment,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/payment", isAutheticated, newPayment);
orderRouter.post("/create-mobile-order", isAutheticated, createMobileOrder);

export default orderRouter;
