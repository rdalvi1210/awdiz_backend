import { Router } from "express";
import authRouter from "./auth.route.js";
import CartRouter from "./cart.route.js";
import productsRouter from "./products.route.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/products", productsRouter);
mainRouter.use("/carts", CartRouter);

export default mainRouter;
