import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
    createProject,
    getProjects,
    searchProjects,
    getSingleProject,
    getMyProjects,
    deleteProject,
    updateProject
} from "../controllers/projectController.js";

import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getProjects);

router.get("/search", searchProjects);

// My Projects
router.get("/my-projects", protect, getMyProjects);

// Single Project
router.get("/:id", getSingleProject);

// Create Project with Image + PDF
router.post(
    "/",
    protect,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 }
    ]),
    createProject
);

// Delete Project
router.delete("/:id", protect, deleteProject);

// Update Project with Image + PDF
router.put(
    "/:id",
    protect,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 }
    ]),
    updateProject
);

export default router;