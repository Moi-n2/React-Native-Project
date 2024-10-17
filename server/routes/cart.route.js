import { Router } from "express";
import { isAutheticated } from "../middleware/auth.js";
import { updateCart } from "../controllers/cart.controller.js";

const cartRouter = Router();
cartRouter.post("/update", isAutheticated, updateCart);
// cartRouter.get("/all", isAutheticated, getCart);

export default cartRouter;
