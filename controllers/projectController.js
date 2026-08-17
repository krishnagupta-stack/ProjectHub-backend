import Project from "../models/project.js";
import cloudinary from "../config/cloudinary.js";

// ===============================
// Cloudinary Upload Function
// ===============================
const uploadToCloudinary = (fileBuffer, resourceType = "image") => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "projecthub",
                resource_type: resourceType
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        stream.end(fileBuffer);
    });
};


// ===============================
// CREATE PROJECT
// ===============================
export const createProject = async (req, res) => {

    try {

        let imageUrl = "";
        let pdfUrl = "";

        // IMAGE UPLOAD
        if (req.files?.image) {

            const imageResult = await uploadToCloudinary(
                req.files.image[0].buffer,
                "image"
            );

            imageUrl = imageResult.secure_url;
        }


        // PDF UPLOAD
        if (req.files?.pdf) {

            const pdfResult = await uploadToCloudinary(
                req.files.pdf[0].buffer,
                "raw"
            );

            pdfUrl = pdfResult.secure_url;
        }


        // CREATE PROJECT
        const project = await Project.create({

            title: req.body.title,

            description: req.body.description,

            technology: req.body.technology,

            category: req.body.category,

            guideName: req.body.guideName,

            githubLink: req.body.githubLink,

            image: imageUrl,

            pdf: pdfUrl,

            createdBy: req.user.id

        });


        res.status(201).json({

            message: "Project Created Successfully",

            project

        });


    } catch (error) {

        console.log("CREATE PROJECT ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }
};


// ===============================
// GET ALL PROJECTS
// ===============================
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


// ===============================
// SEARCH PROJECT
// ===============================
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


// ===============================
// GET SINGLE PROJECT
// ===============================
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


// ===============================
// GET MY PROJECTS
// ===============================
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


// ===============================
// DELETE PROJECT
// ===============================
export const deleteProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id);


        if (!project) {

            return res.status(404).json({

                message: "Project Not Found"

            });

        }


        // ONLY OWNER CAN DELETE
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


// ===============================
// UPDATE PROJECT
// ===============================
export const updateProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id);


        if (!project) {

            return res.status(404).json({

                message: "Project Not Found"

            });

        }


        // ONLY OWNER CAN UPDATE
        if (project.createdBy.toString() !== req.user.id) {

            return res.status(401).json({

                message: "Not Authorized"

            });

        }


        // TEXT DATA
        const updateData = {

            title: req.body.title,

            description: req.body.description,

            technology: req.body.technology,

            category: req.body.category,

            guideName: req.body.guideName,

            githubLink: req.body.githubLink

        };


        // NEW IMAGE
        if (req.files?.image) {

            const imageResult = await uploadToCloudinary(

                req.files.image[0].buffer,

                "image"

            );

            updateData.image = imageResult.secure_url;

        }


        // NEW PDF
        if (req.files?.pdf) {

            const pdfResult = await uploadToCloudinary(

                req.files.pdf[0].buffer,

                "raw"

            );

            updateData.pdf = pdfResult.secure_url;

        }


        const updatedProject =
            await Project.findByIdAndUpdate(

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

        console.log("UPDATE PROJECT ERROR:", error);

        res.status(500).json({

            message: error.message

        });

    }
};