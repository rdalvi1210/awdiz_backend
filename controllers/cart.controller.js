import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number" || quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
      await cart.save();

      return res.status(200).json({ success: true, message: "Product added" });
    }

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Product added" });
  } catch (err) {
    console.error("Add Cart Err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.user;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: [],
        totalPrice: 0,
      });
    }

    let totalPrice = cart.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);
    console.log(cart.items);
    return res.status(200).json({
      success: true,
      cart: cart.items,
      totalPrice,
    });
  } catch (err) {
    console.error("Get Cart Err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();

    const updated = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    const totalPrice = updated.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    return res.status(200).json({
      success: true,
      message: "Removed",
      cart: updated.items,
      totalPrice,
    });
  } catch (err) {
    console.error("Remove Err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
