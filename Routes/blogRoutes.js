import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/blog", createBlog);           // Create a new blog
router.get("/blogs", getAllBlogs);          // Get all blogs
router.get("/blog/:id", getBlogById);       // Get a single blog by ID
router.put("/blog/:id", updateBlog);        // Update a blog by ID
router.delete("/blog/:id", deleteBlog);     // Delete a blog by ID

export default router;