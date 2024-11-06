import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

// Configure multer for file uploads with a 1MB size limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");  // Directory for storing uploaded images
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

// Create a new product
export const createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }

    const { name, sr_no, model, price, aval, detail } = req.body;
    const image = req.file;
    
    if (!name || !sr_no || !model || !price || !aval|| !detail || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const product = new Product({
        name,
        sr_no,
        model,
        price,
        aval,
        detail,
        imagePath: image.path
      });

      await product.save();
      res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Error saving product", error });
    }
  });
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

// Update product information by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }

    const { name, sr_no, model, price, aval, detail } = req.body;
    const image = req.file;

    const updateData = {};
    if (name) updateData.name = name;
    if (sr_no) updateData.sr_no = sr_no;
    if (model) updateData.model = model;
    if (price) updateData.price = price;
    if (aval !== undefined) updateData.aval = aval === "true";
    if (detail) updateData.detail = detail;
    if (image) updateData.imagePath = image.path;

    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  });
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
