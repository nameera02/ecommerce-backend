import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  client: { type: String, required: true },
  description: { type: String, required: true },
  equipmentDelivery: { type: String, required: true },  // Assuming this is a date field
  sr_no: { type: Number, unique: true, required: true },
  type: { 
    type: String, 
    enum: ['oversea', 'nationW'], 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
