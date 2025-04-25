import { Request, Response } from "express";

import { z } from "zod";
import pool from "../../config/db";


export const experienceSchema = z.object({
    company_name: z.string().min(1, "Company name is required"),
    position: z.string().optional(),
    start_date: z.string().optional(), // format: "YYYY-MM-DD"
    end_date: z.string().optional(),
    description: z.string().optional(),
    currently_working: z.boolean().optional(),
});

// CREATE
export const createExperience = async (req: Request, res: Response): Promise<void> => {
    const profileId = parseInt(req.params.profileId, 10);
    if (isNaN(profileId)) {
        res.status(400).json({ error: "Invalid profile ID" });
        return;
    }

    const parsed = experienceSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.format() });
        return;
    }

    const {
        company_name,
        position,
        start_date,
        end_date,
        description,
        currently_working,
    } = parsed.data;

    try {
        const result = await pool.query(
            `
      INSERT INTO jobseeker_experience (
        jobseeker_profile_id,
        company_name,
        position,
        start_date,
        end_date,
        description,
        currently_working
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
            [
                profileId,
                company_name,
                position || null,
                start_date || null,
                end_date || null,
                description || null,
                currently_working || false,
            ]
        );

        res.status(201).json({ data: result.rows[0] });
    } catch (error) {
        console.error("Error creating experience:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET ALL EXPERIENCES FOR A PROFILE
export const getExperiencesByProfile = async (req: Request, res: Response): Promise<void> => {
    const profileId = parseInt(req.params.profileId, 10);
    if (isNaN(profileId)) {
        res.status(400).json({ error: "Invalid profile ID" });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT * FROM jobseeker_experience WHERE jobseeker_profile_id = $1 ORDER BY start_date DESC`,
            [profileId]
        );
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE EXPERIENCE BY ID
export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
    const experienceId = parseInt(req.params.experienceId, 10);
    if (isNaN(experienceId)) {
        res.status(400).json({ error: "Invalid experience ID" });
        return;
    }

    try {
        const result = await pool.query(
            `DELETE FROM jobseeker_experience WHERE id = $1 RETURNING *`,
            [experienceId]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ error: "Experience not found" });
        } else {
            res.status(200).json({ message: "Experience deleted successfully" });
        }
    } catch (error) {
        console.error("Error deleting experience:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
