import express from "express";
import {
  addComment,
  createBlog,
  getAllBlogs,
} from "../controllers/blog.controller.js";

const blogRouter = express.Router();

// CREATE BLOG
blogRouter.post("/create", createBlog);

// ADD COMMENT OR REPLY
blogRouter.post("/comment", addComment);

// GET ALL BLOGS + ALL COMMENTS
blogRouter.get("/all", getAllBlogs);

export default blogRouter;
