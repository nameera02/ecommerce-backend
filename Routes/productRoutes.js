import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/product", createProduct);           // Create a new product
router.get("/products", getAllProducts);          // Get all products
router.get("/product/:id", getProductById);       // Get a single product by ID
router.put("/product/:id", updateProduct);        // Update a product by ID
router.delete("/product/:id", deleteProduct);     // Delete a product by ID

export default router;