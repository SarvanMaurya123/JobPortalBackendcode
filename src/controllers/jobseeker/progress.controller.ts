import { Request, Response } from "express";
import pool from "../../config/db";

// GET /api/profile/completion/:profileId
export const getProfileCompletionInfo = async (req: Request, res: Response): Promise<void> => {
    const { profileId } = req.params;

    try {
        // First, get the basic profile to extract the user_id for portfolio
        const profileResult = await pool.query("SELECT * FROM jobseeker_profiles WHERE id = $1", [profileId]);
        const basicInfo = profileResult.rows[0];

        if (!basicInfo) {
            res.status(404).json({ success: false, message: "Profile not found" });
            return;
        }

        const userId = basicInfo.user_id;

        // Fetch rest of the data
        const [education, experience, skills, user] = await Promise.all([
            pool.query("SELECT * FROM jobseeker_education WHERE jobseeker_profile_id = $1", [profileId]),
            pool.query("SELECT * FROM jobseeker_experience WHERE jobseeker_profile_id = $1", [profileId]),
            pool.query("SELECT * FROM jobseeker_skills WHERE jobseeker_profile_id = $1", [profileId]),
            pool.query("SELECT portfolio FROM users WHERE id = $1", [userId]),
        ]);

        const data = {
            basicInfo,
            education: education.rows || [],
            experience: experience.rows || [],
            skills: skills.rows || [],
            portfolio: user.rows[0]?.portfolio || null,
        };

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching profile completion data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
