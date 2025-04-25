import express from "express";
import { getFullResumeData } from "../../controllers/jobseeker/getalljobseekerinfo";

const router = express.Router();

router.get("/resume/:profileId/:userId", getFullResumeData);

export default router;
