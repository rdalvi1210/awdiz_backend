import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const Seller = mongoose.model("seller", sellerSchema);

export default Seller;
