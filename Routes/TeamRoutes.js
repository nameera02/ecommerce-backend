import express from "express"
import multer from "multer"
import {deleteTeamMember,updateTeamMember,getTeamMemberById,createTeamMember,getAllTeamMembers} from "../controllers/TeamController.js"

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }  // 1 MB limit
});

// Define routes
router.post('/team', createTeamMember);
router.get('/team', getAllTeamMembers);
router.get('/team/:id', getTeamMemberById);
router.put('/team/:id', upload.single('image'), updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

export default router;
