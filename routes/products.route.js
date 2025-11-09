import { Router } from "express";
import {
  addProduct,
  deleteProducts,
  editProducts,
  getAllProducts,
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.post("/addproducts", addProduct);
productsRouter.get("/getproducts", getAllProducts);
productsRouter.delete("/deleteproducts/:id", deleteProducts);
productsRouter.put("/editproducts/:id", editProducts);

export default productsRouter;
