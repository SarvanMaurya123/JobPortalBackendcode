import { Request, Response } from "express";

import { z } from "zod";
import pool from "../../config/db";

//zod validation
export const educationSchema = z.object({
    institution_name: z.string().min(1, "Institution name is required"),
    degree: z.string().optional(),
    field_of_study: z.string().optional(),
    start_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    end_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    grade_or_percentage: z.string().optional(),
    jobseeker_profile_id: z.number(),

});

export const createEducation = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate input using Zod
        const validatedData = educationSchema.parse(req.body);

        const {
            institution_name,
            degree,
            field_of_study,
            start_year,
            end_year,
            grade_or_percentage,
            jobseeker_profile_id

        } = validatedData;

        // Insert into the database
        const result = await pool.query(
            `INSERT INTO jobseeker_education 
             (jobseeker_profile_id, institution_name, degree, field_of_study, start_year, end_year, grade_or_percentage)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                jobseeker_profile_id,
                institution_name,
                degree,
                field_of_study,
                start_year,
                end_year,
                grade_or_percentage,
            ]
        );


        res.status(201).json({
            message: "Education added successfully",
            education: result.rows[0],
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            res.status(400).json({ message: "Validation failed", errors: error.errors });
        } else {
            console.error("Error creating education:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

// GET all education entries for a specific jobseeker
export const getEducationByProfileId = async (req: Request, res: Response): Promise<void> => {
    const { profileId } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM jobseeker_education WHERE jobseeker_profile_id = $1 ORDER BY start_year DESC`,
            [profileId]
        );

        res.status(200).json({
            message: "Education records retrieved",
            education: result.rows,
        });
    } catch (error) {
        console.error("Error fetching education records:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// DELETE education by education ID
export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
    const { educationId } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM jobseeker_education WHERE id = $1 RETURNING *`,
            [educationId]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Education record not found" });
            return;
        }

        res.status(200).json({
            message: "Education record deleted successfully",
            deletedEducation: result.rows[0],
        });
    } catch (error) {
        console.error("Error deleting education:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
