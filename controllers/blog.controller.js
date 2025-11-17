import Blog from "../model/blog.model.js";
import Comment from "../model/comment.model.js";

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const { author, title, content, imageUrl } = req.body;

    if (!author || !title || !content || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const blog = await Blog.create({
      author,
      title,
      content,
      imageUrl,
    });

    return res.json({
      success: true,
      message: "Blog created",
      blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD COMMENT / REPLY
export const addComment = async (req, res) => {
  try {
    const { blogId, author, message, parentId } = req.body;

    if (!blogId || !author || !message) {
      return res.status(400).json({
        success: false,
        message: "blogId, author and message are required",
      });
    }

    // check blog exists
    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // validate parent
    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent) {
        return res
          .status(404)
          .json({ success: false, message: "Parent comment not found" });
      }
    }

    const newComment = await Comment.create({
      blogId,
      author,
      message,
      parentId: parentId || null,
    });

    return res.json({
      success: true,
      message: parentId ? "Reply added" : "Comment added",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// SIMPLE FETCH — ZERO COMPLEXITY
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    const comments = await Comment.find().sort({ createdAt: 1 });

    return res.json({
      success: true,
      blogs,
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
