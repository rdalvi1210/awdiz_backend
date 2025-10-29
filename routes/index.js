import { Router } from "express";
import authRouter from "./auth.route.js";
import productsRouter from "./products.route.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/products", productsRouter);

export default mainRouter;
