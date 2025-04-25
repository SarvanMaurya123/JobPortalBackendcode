import express from "express";
import { createExperience, deleteExperience, getExperiencesByProfile } from "../../controllers/jobseeker/jobseekerexperinces";
import verifyUserJWT from "../../middleware/auth.middlewere";


const router = express.Router();

// POST - Create experience
router.post("/experience/:profileId", verifyUserJWT, createExperience);

// GET - All experiences for a profile
router.get("/experience/:profileId", verifyUserJWT, getExperiencesByProfile);

// DELETE - Single experience by experience ID
router.delete("/experience/delete/:experienceId", verifyUserJWT, deleteExperience);

export default router;
