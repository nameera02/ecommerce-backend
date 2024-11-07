import Team from "../models/Team.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");  // Directory for storing uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 },  // 1MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, JPG, PNG) are allowed"));
    }
  }
}).single("image");  // Expecting a single file upload with field name "image"


// Insert new team member
export const createTeamMember = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: "Error: " + err.message });
    }

  const { name, designation, email } = req.body;
  console.log(req.body);
  
  const image = req.file;

  if (!name || !designation || !email || !image) {
    return res.status(400).json({ message: 'All fields are required, including the image' });
  }

  try {
    const teamMember = new Team({
      name,
      designation,
      email,
      imagePath: image.path
    });

    await teamMember.save();
    res.status(201).json({ message: 'Team member created successfully', teamMember });
  } catch (error) {
    res.status(500).json({ message: 'Error saving team member', error });
  }
});
};

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const teams = await Team.find();
    const teamsWithCorrectImagePath = teams.map(team => {
      const correctImagePath = team.imagePath.replace(/\\+/g, '/');
      return {
        ...team.toObject(),
        imagePath: `http://localhost:3000/${correctImagePath}`
      };
    });
    res.status(200).json({ teams:teamsWithCorrectImagePath });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving team members', error });
  }
};

// Get a single team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving team member', error });
  }
};

// Update a team member by ID
export const updateTeamMember = async (req, res) => {
  const { name, designation, email } = req.body;
  const image = req.file;

  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    if (name) teamMember.name = name;
    if (designation) teamMember.designation = designation;
    if (email) teamMember.email = email;
    if (image) teamMember.imagePath = image.path;

    await teamMember.save();
    res.json({ message: 'Team member updated successfully', teamMember });
  } catch (error) {
    res.status(500).json({ message: 'Error updating team member', error });
  }
};

// Delete a team member by ID
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team member', error });
  }
};
