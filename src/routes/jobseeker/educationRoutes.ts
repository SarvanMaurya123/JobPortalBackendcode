import express from "express";
import { createEducation, deleteEducation, getEducationByProfileId } from "../../controllers/jobseeker/education.controller";
import verifyUserJWT from "../../middleware/auth.middlewere";


const router = express.Router();

router.post("/education", verifyUserJWT, createEducation);
router.get("/education/:profileId", verifyUserJWT, getEducationByProfileId);
router.delete("/education/:educationId", verifyUserJWT, deleteEducation);

export default router;
