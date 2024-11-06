import express from "express";
import {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
} from "../controllers/CertificateController.js";

const router = express.Router();

// Define routes
router.post("/certificates", createCertificate);
router.get("/certificates", getAllCertificates);
router.get("/certificates/:id", getCertificateById);
router.put("/certificates/:id", updateCertificate);
router.delete("/certificates/:id", deleteCertificate);

export default router;