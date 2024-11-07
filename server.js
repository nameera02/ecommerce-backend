import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import teamRoutes from "./Routes/TeamRoutes.js"
import certificateRoutes from "./Routes/CertificateRoutes.js";
import BrandRoutes from "./Routes/BrandRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import clientRoutes from "./Routes/clientRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";
import contactRoutes from "./Routes/contactRoutes.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const app = express();

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001', // Allow all origins (replace '*' with specific origins if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(`${__dirname}/uploads`));


app.use('/api', teamRoutes);
app.use("/api", certificateRoutes); // Use the certificate routes
app.use("/api", BrandRoutes); 
app.use("/api", projectRoutes);
app.use("/api", clientRoutes);
app.use("/api", productRoutes);
app.use("/api", blogRoutes);
app.use('/api', contactRoutes);


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));