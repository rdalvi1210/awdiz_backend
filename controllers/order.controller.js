import Cart from "../model/cart.model.js";
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch user's cart with product info
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const orderProducts = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart no longer exists.",
        });
      }
      console.log(item.quantity);
      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available for ${product.title}. 35`,
        });
      }

      // Add product to order
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
      });

      // Calculate total
      totalPrice += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalPrice: totalPrice,
    });

    // Reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while placing order.",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.user;

    const orders = await Order.find({ user: userId }).populate({
      path: "products.product",
    });

    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error, "error");
    return res.json({ success: false, message: "Internal error." });
  }
};
