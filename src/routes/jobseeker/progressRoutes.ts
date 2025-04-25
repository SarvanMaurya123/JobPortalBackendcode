// routes/profileRoutes.ts
import express from "express";
import { getProfileCompletionInfo } from "../../controllers/jobseeker/progress.controller";

const router = express.Router();
router.get("/completion/:profileId", getProfileCompletionInfo);
export default router;
