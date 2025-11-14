import { Router } from "express";
import { getOrders, placeOrder } from "../controllers/order.controller.js";

const ordersRouter = Router();

ordersRouter.get("/placeorder", placeOrder);
ordersRouter.get("/myorders", getOrders);

export default ordersRouter;
