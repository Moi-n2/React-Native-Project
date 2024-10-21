import { Router } from "express";
import { isAutheticated } from "../middleware/auth.js";
import {
  createMobileOrder,
  newPayment,
  placeOrderStripe,
  verifyStripe,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/payment", isAutheticated, newPayment);
orderRouter.post("/create-mobile-order", isAutheticated, createMobileOrder);
orderRouter.get("/stripe-payment", isAutheticated, placeOrderStripe);
orderRouter.post("/stripe-verify", isAutheticated, verifyStripe);

export default orderRouter;
