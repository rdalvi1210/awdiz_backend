import { Router } from "express";
import {
  addToCart,
  getUserCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const CartRouter = Router();

CartRouter.post("/add", addToCart);
CartRouter.get("/getcart", getUserCart);
CartRouter.post("/remove", removeFromCart);

export default CartRouter;
