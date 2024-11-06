import mongoose from "mongoose"

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imagePath: { type: String, required: true }
});

export default mongoose.model('Team', teamSchema);