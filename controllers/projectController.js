import Project from "../models/Project.js";

// Function to create a new project
export const createProject = async (req, res) => {
  const { name, location, client, description, equipmentDelivery, sr_no, type } = req.body;

  // Validate required fields
  if (!name || !location || !client || !description || !equipmentDelivery || !sr_no || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Shift existing sr_no if it conflicts with the provided sr_no
    const existingProjects = await Project.find({ sr_no: { $gte: sr_no } }).sort({ sr_no: -1 });
    for (const project of existingProjects) {
      await Project.findByIdAndUpdate(project._id, { sr_no: project.sr_no + 1 });
    }

    // Create the new project
    const project = new Project({
      name,
      location,
      client,
      description,
      equipmentDelivery,
      sr_no,
      type
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error saving project", error });
  }
};

// Function to get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving projects", error });
  }
};

// Function to get a single project by ID
export const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving project", error });
  }
};

// Function to update a project by ID
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { sr_no, ...updateData } = req.body;

  try {
    // Shift existing sr_no if a new sr_no is provided and causes a conflict
    if (sr_no) {
      const existingProjects = await Project.find({ sr_no: { $gte: sr_no } }).sort({ sr_no: -1 });
      for (const project of existingProjects) {
        await Project.findByIdAndUpdate(project._id, { sr_no: project.sr_no + 1 });
      }
      updateData.sr_no = sr_no;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project updated successfully", updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
};

// Function to delete a project by ID
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
