import express from "express";
import {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} from "../controllers/BrandController.js";

const router = express.Router();

// Route for creating a brand
router.post("/brand", createBrand);

// Route for getting all brands
router.get("/brands", getAllBrands);

// Route for updating a brand by ID
router.put("/brand/:id", updateBrand);

// Route for deleting a brand by ID
router.delete("/brand/:id", deleteBrand);

export default router;
