import Team from "../models/Team.js";
// Insert new team member
export const createTeamMember = async (req, res) => {
  const { name, designation, email } = req.body;
  const image = req.file;

  if (!name || !designation || !email || !image) {
    return res.status(400).json({ message: 'All fields are required, including the image'+name });
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
};

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const team = await Team.find();
    res.json(team);
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
