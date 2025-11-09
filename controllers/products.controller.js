// export const getProducts = (req, res) => {
//   res.send("Hello, This is getproducts api");
// };

import Product from "../model/product.model.js";

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
    console.log("Seller ID:", sellerId);

    const products = await Product.find({
      createdBy: sellerId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
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

export const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Product already deleted",
      });
    }

    product.isDeleted = true;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product soft deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during product deletion",
    });
  }
};

export const editProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, brand, price, description } = req.body;

    // 1️⃣ Validate input
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required fields.",
      });
    }

    // 2️⃣ Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // 3️⃣ Prevent editing deleted items
    if (product.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit a deleted product.",
      });
    }

    // 4️⃣ Update product fields
    product.title = title || product.title;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.description = description || product.description;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating product.",
    });
  }
};
