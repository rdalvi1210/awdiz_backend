import { Router } from "express";
import {
  addProduct,
  getAllProducts,
} from "../controllers/products.controller.js";
import { verifyToken } from "../middleware/verifytoken.middleware.js";

const productsRouter = Router();

productsRouter.post("/addproducts", verifyToken, addProduct);
productsRouter.get("/getproducts", verifyToken, getAllProducts);

export default productsRouter;
