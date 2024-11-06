import Blog from "../models/Blog.js";
import multer from "multer";
import path from "path";

// Configure multer for file uploads with a 1MB size limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blogs");  // Directory for storing blog images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },  // 1MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, JPG, PNG) are allowed"));
    }
  }
}).single("image");  // Expecting a single file upload with field name "image"

// Create a new blog
export const createBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }

    const { name, description } = req.body;
    const image = req.file;

    if (!name || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const blog = new Blog({
        name,
        description,
        imagePath: image.path
      });

      await blog.save();
      res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
      res.status(500).json({ message: "Error saving blog", error });
    }
  });
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error });
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog", error });
  }
};

// Update blog information by ID
export const updateBlog = async (req, res) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }

    const { name, description } = req.body;
    const image = req.file;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (image) updateData.imagePath = image.path;

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json({ message: "Blog updated successfully", updatedBlog });
    } catch (error) {
      res.status(500).json({ message: "Error updating blog", error });
    }
  });
};

// Delete a blog by ID
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
