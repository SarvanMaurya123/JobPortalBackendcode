import express from "express";
import { applyForJob, deleteApplication, getJobApplications } from "../../controllers/jobseeker/applyalljobs.controller";
import verifyUserJWT from "../../middleware/auth.middlewere";


const router = express.Router();

router.post("/applications/apply", verifyUserJWT, applyForJob);
router.get("/applications/:jobseekerId", verifyUserJWT, getJobApplications);
router.delete("/applications/:applicationId", verifyUserJWT, deleteApplication);

export default router;
