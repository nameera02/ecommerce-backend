import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sr_no: { type: Number, required: true, unique: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  aval:  { 
    type: String, 
    enum: ['instock', 'outofstock','inorder'], 
  },
  detail: { type: String, required: true },
  imagePath: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Product", productSchema)