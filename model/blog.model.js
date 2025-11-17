import { model, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    author: { type: String, required: true }, // THIS IS USERNAME
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Blog = model("Blog", blogSchema);

export default Blog;
