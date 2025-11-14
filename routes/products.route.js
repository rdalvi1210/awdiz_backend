import { Router } from "express";
import { getFilterAllProducts } from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/getallfilterproducts", getFilterAllProducts);

export default productsRouter;
