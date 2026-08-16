import Project from "../models/project.js";

// Create Project
export const createProject = async (req, res) => {
    try {

        const project = await Project.create({
            title: req.body.title,
            description: req.body.description,
            technology: req.body.technology,
            category: req.body.category,
            guideName: req.body.guideName,
            githubLink: req.body.githubLink,

            // Image
            image: req.files?.image
                ? `/uploads/${req.files.image[0].filename}`
                : "",

            // PDF
            pdf: req.files?.pdf
                ? `/uploads/${req.files.pdf[0].filename}`
                : "",

            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Project Created Successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get All Projects
export const getProjects = async (req, res) => {
    try {

        const projects = await Project.find()
            .populate("createdBy", "name email");

        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Search Project
export const searchProjects = async (req, res) => {
    try {

        const { keyword } = req.query;

        const projects = await Project.find({
            title: {
                $regex: keyword,
                $options: "i"
            }
        });

        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get Single Project
export const getSingleProject = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project Not Found"
            });
        }

        res.status(200).json(project);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get My Projects
export const getMyProjects = async (req, res) => {
    try {

        const projects = await Project.find({
            createdBy: req.user.id
        }).populate("createdBy", "name email");

        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Delete Project
export const deleteProject = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project Not Found"
            });
        }

        // Only Project Owner can delete
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Not Authorized"
            });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Project Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update Project
export const updateProject = async (req, res) => {
    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project Not Found"
            });
        }

        // Only Project Owner can update
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Not Authorized"
            });
        }

        // Text fields
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            technology: req.body.technology,
            category: req.body.category,
            guideName: req.body.guideName,
            githubLink: req.body.githubLink
        };

        // New Image uploaded
        if (req.files?.image) {
            updateData.image =
                `/uploads/${req.files.image[0].filename}`;
        }

        // New PDF uploaded
        if (req.files?.pdf) {
            updateData.pdf =
                `/uploads/${req.files.pdf[0].filename}`;
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true
            }
        );

        res.status(200).json({
            message: "Project Updated Successfully",
            project: updatedProject
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};