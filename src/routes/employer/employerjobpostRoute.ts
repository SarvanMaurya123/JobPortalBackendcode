import { Router } from "express";
import verifyEmployerJWT from "../../middleware/employer.middlewere";
import {
    deleteJob,
    getAllApplications,
    getJobAnalytics,
    getJobs,
    jobseekersGetData,
    JobsPost,
    updateJob,
} from "../../controllers/employer/employer_jobpost";
import verifyUserJWT from "../../middleware/auth.middlewere";

const router = Router();

// Create a new job
router.post("/jobs", verifyEmployerJWT, JobsPost);

// Get a specific job by ID
router.get("/jobs/:id", verifyEmployerJWT, getJobs);

// Update a specific job
router.put("/jobs/:id", verifyEmployerJWT, updateJob);

// Delete a specific job
router.delete("/jobs/:id", verifyEmployerJWT, deleteJob);

router.get("/jobseeker/jobs/:id", verifyUserJWT, jobseekersGetData);


//get all applyed job
router.get('/applications', verifyEmployerJWT, getAllApplications); // GET /applications

//job analytics
router.get('/analytics', verifyEmployerJWT, getJobAnalytics);


export default router;
