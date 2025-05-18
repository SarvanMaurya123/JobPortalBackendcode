import { Request, Response } from "express";
import pool from "../../config/db";

// POST - Apply for a job
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
    const { jobseeker_id, job_id, name } = req.body;

    if (!jobseeker_id || !job_id || !name) {
        res.status(400).json({
            success: false,
            message: "Missing required fields (jobseeker_id, job_id, name)",
        });
    }

    try {
        const existing = await pool.query(
            "SELECT * FROM jobseeker_job_apply WHERE jobseeker_id = $1 AND job_id = $2",
            [jobseeker_id, job_id]
        );

        if (existing.rows.length > 0) {
            res.status(409).json({
                success: false,
                message: "You have already applied for this job",
            });
        }

        await pool.query(
            "INSERT INTO jobseeker_job_apply (jobseeker_id, job_id, name) VALUES ($1, $2, $3)",
            [jobseeker_id, job_id, name]
        );

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
        });

    } catch (error) {
        console.error("Apply Error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Server error while applying for job",
            });
        }
    }
};

// GET - Applications for a jobseeker
export const getJobApplications = async (req: Request, res: Response): Promise<void> => {
    const { jobseekerId } = req.params;

    try {
        const result = await pool.query(
            `SELECT a.id, a.application_date, a.status, j.title, j.company
             FROM jobseeker_job_apply a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.jobseeker_id = $1
             ORDER BY a.application_date DESC`,
            [jobseekerId]
        );

        res.status(200).json({
            success: true,
            applications: result.rows,
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE - Cancel application
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM job_applications WHERE id = $1 RETURNING *",
            [applicationId]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ success: false, message: "Application not found" });
        }

        res.status(200).json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
