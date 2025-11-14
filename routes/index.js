import { Router } from "express";
import authRouter from "./auth.route.js";
import CartRouter from "./cart.route.js";
import ordersRouter from "./order.route.js";
import productsRouter from "./products.route.js";
import sellerRouter from "./seller.route.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/carts", CartRouter);
mainRouter.use("/seller", sellerRouter);
mainRouter.use("/order", ordersRouter);

export default mainRouter;
