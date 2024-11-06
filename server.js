import mongoose from "mongoose"
import express from "express"
import teamRoutes from "./Routes/TeamRoutes.js"
import certificateRoutes from "./Routes/CertificateRoutes.js";
import BrandRoutes from "./Routes/BrandRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import clientRoutes from "./Routes/clientRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";

const app = express();

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

app.use(express.json());

// Use the team routes
app.use('/api', teamRoutes);
app.use("/api", certificateRoutes); // Use the certificate routes
app.use("/api", BrandRoutes); 
app.use("/api", projectRoutes);
app.use("/api", clientRoutes);
app.use("/api", productRoutes);
app.use("/api", blogRoutes);



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
