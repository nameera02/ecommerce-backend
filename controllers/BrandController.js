import Brand from "../models/Brand.js";

// Function to create a brand
export const createBrand = async (req, res) => {
  const { name, description, authorize, sr_no } = req.body;
  console.log(req.body); 
  // Validate input
  if (!name || !description || typeof authorize !== "boolean" || sr_no === undefined) {
    return res.status(400).json({ message: "All fields are required"+name });
  }

  try {
    // Check if the provided sr_no already exists
    const existingBrand = await Brand.findOne({ sr_no });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand with this sr_no already exists" });
    }

    // Create new brand
    const brand = new Brand({ name, description, authorize, sr_no });
    await brand.save();
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (error) {
    res.status(500).json({ message: "Error saving brand", error });
  }
};

// Function to get all brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving brands", error });
  }
};

// Function to update a brand
export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, description, authorize, sr_no } = req.body;

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Update fields
    if (name) brand.name = name;
    if (description) brand.description = description;
    if (authorize !== undefined) brand.authorize = authorize;
    if (sr_no) brand.sr_no = sr_no;

    await brand.save();
    res.status(200).json({ message: "Brand updated successfully", brand });
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error });
  }
};

// Function to delete a brand
export const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting brand", error });
  }
};
