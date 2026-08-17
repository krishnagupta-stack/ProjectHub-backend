import express from "express";

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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/search", searchProjects);
router.get("/my-projects", protect, getMyProjects);
router.get("/:id", getSingleProject);
router.post(
    "/",
    protect,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 }
    ]),
    createProject
);

router.put(
    "/:id",
    protect,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 }
    ]),
    updateProject
);

router.delete("/:id", protect, deleteProject);

export default router;