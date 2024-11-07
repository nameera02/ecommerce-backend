import Certificate from "../models/Certificate.js";
import multer from "multer";

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
}).single("image");

// Function to create a certificate
export const createCertificate = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading image", error: err });
      }
  
      const { sr_no,name } = req.body;
      console.log(req.body);
      
      const image = req.file;
  
      // Check if the required fields are provided
      if (!sr_no || !image) {
        return res.status(400).json({ message: "sr_no and image are required" });
      }
  
      try {
        // First, find all certificates with sr_no greater than or equal to the new sr_no
        const existingCertificates = await Certificate.find({ sr_no: { $gte: sr_no } })
          .sort({ sr_no: -1 }); // Sort in descending order
  
        // If there are existing certificates, increment their sr_no
        if (existingCertificates.length > 0) {
          // Loop through existing certificates and update their sr_no
          for (let certificate of existingCertificates) {
            certificate.sr_no += 1; // Increment sr_no
            await certificate.save(); // Save the updated certificate
          }
        }
  
        // Create new certificate with the provided sr_no
        const certificate = new Certificate({
          sr_no: sr_no,
          imagePath: image.path,
          name:name
        });
  
        await certificate.save();
        res.status(201).json({ message: "Certificate created successfully", certificate });
      } catch (error) {
        res.status(500).json({ message: "Error saving certificate", error });
      }
    });
  };

// Function to get all certificates
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ sr_no: 1 }); // Sort by sno in ascending order
    const certificatesWithCorrectImagePath = certificates.map(certificate => {
      const correctImagePath = certificate.imagePath.replace(/\\+/g, '/');
      return {
        ...certificate.toObject(),
        imagePath: `http://localhost:3000/${correctImagePath}`
      };
    });
    res.status(200).json({certificates:certificatesWithCorrectImagePath});
  } catch (error) {
    res.status(500).json({ message: "Error retrieving certificates", error });
  }
};

// Function to get a certificate by ID
export const getCertificateById = async (req, res) => {
  const { id } = req.params;
  try {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving certificate", error });
  }
};

// Function to update a certificate
export const updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { sr_no } = req.body; // New serial number
  const image = req.file;

  try {
    // Check if the new sr_no already exists for another certificate
    if (sr_no) {
      const existingCertificate = await Certificate.findOne({ sr_no });

      if (existingCertificate && existingCertificate._id.toString() !== id) {
        // Increment sr_no for existing certificates greater than or equal to the new sr_no
        await Certificate.updateMany(
          { sr_no: { $gte: sr_no } },
          { $inc: { sr_no: 1 } }
        );
      }
    }

    // Prepare update data
    const updateData = {};
    if (sr_no) updateData.sr_no = sr_no;
    if (image) updateData.imagePath = image.path;

    // Update the certificate
    const updatedCertificate = await Certificate.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCertificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({ message: "Certificate updated successfully", updatedCertificate });
  } catch (error) {
    res.status(500).json({ message: "Error updating certificate", error });
  }
};

// Function to delete a certificate
export const deleteCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCertificate = await Certificate.findByIdAndDelete(id);
    if (!deletedCertificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting certificate", error });
  }
};
