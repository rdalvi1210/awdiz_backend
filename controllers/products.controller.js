import Product from "../model/product.model.js";

export const getFilterAllProducts = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    const { category } = req.query;
    if (category) {
      const categories = category
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter((c) => c.length > 0);

      if (categories.length > 1) {
        filter.category = { $in: categories };
      } else {
        filter.category = categories[0];
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Filtered Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching products.",
    });
  }
};
