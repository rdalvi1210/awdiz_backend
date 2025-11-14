import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    // Basic details
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },

    imageUrl: {
      type: String,
      required: [true, "Product image URL is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🔥 NEW FIELD for cart quantity logic
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0, // optional: set 0 means out of stock
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", productSchema);

export default Product;
