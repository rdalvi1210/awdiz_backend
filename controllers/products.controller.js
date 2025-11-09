// export const getProducts = (req, res) => {
//   res.send("Hello, This is getproducts api");
// };

import Product from "../model/product.model.js";
import Seller from "../model/sellers.model.js";

export const addProduct = async (req, res) => {
  try {
    const { title, category, imageUrl, brand, description, price } = req.body;

    // ✅ Validate required fields
    if (!title || !category || !imageUrl || !brand || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // ✅ Create product document
    const newProduct = await Product.create({
      title,
      category,
      imageUrl,
      brand,
      description,
      price,
      createdBy: req.user?.userId || null, // optional if token is used
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding product.",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const sellerId = req.user?.userId;
    console.log(sellerId);
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again.",
      });
    }

    const seller = await Seller.findById(sellerId).select("-password");
    console.log(seller, "prcontr");
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }
    console.log("seller from controller produts", seller);
    // ✅ Get all products created by this seller
    const products = await Product.find({ createdBy: sellerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      seller,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching seller products.",
    });
  }
};
