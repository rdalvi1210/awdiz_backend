import { Router } from "express";
import {
  addProduct,
  deleteProducts,
  editProducts,
  getAllProducts,
  getSellerOrders,
} from "../controllers/seller.controller.js";

const sellerRouter = Router();

sellerRouter.get("/getproducts", getAllProducts);
sellerRouter.delete("/deleteproducts/:id", deleteProducts);
sellerRouter.put("/editproducts/:id", editProducts);
sellerRouter.post("/addProducts", addProduct);
sellerRouter.get("/seller-orders", getSellerOrders);

export default sellerRouter;
