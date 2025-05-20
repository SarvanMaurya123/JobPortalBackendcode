// controllers/jobsController.ts
import { Request, Response } from "express";
import { z } from "zod";
import pool from "../../config/db";

// Zod schema based on the updated table
const jobPostSchema = z.object({
    employer_id: z.number().int().positive(),
    title: z.string().min(3),
    company: z.string().min(2),
    location: z.string().min(2),
    employment_type: z.enum(["Full-time", "Part-time", "Internship", "Contract"]).optional().default("Full-time"),
    experience_level: z.string().optional().default("Entry-level"),
    salary: z.string().optional(),
    description: z.string().optional(),
    requirements: z.string().optional(),
    benefits: z.string().optional(),
    application_deadline: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
        })
        .refine((date) => new Date(date) > new Date(), {
            message: "Application deadline must be a future date",
        }),
    contact_email: z.string().email()
});

export const JobsPost = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request with Zod
        const jobData = jobPostSchema.parse(req.body);

        const {
            employer_id,
            title,
            company,
            location,
            employment_type,
            experience_level,
            salary,
            description,
            requirements,
            benefits,
            application_deadline,
            contact_email
        } = jobData;

        // Insert into jobs table
        const result = await pool.query(
            `INSERT INTO jobs (
        employer_id, title, company, location, employment_type,
        experience_level, salary, description, requirements,
        benefits, application_deadline, contact_email
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12
      ) RETURNING *`,
            [
                employer_id, title, company, location, employment_type,
                experience_level, salary, description, requirements,
                benefits, application_deadline, contact_email
            ]
        );

        res.status(201).json({
            message: "Job posted successfully",
            job: result.rows[0],
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            console.error("Error posting job:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};


// job get data
export const getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { employer_id } = req.query;

        const query = employer_id
            ? `
                SELECT 
                    jobs.*, 
                    COUNT(jobseeker_job_apply.job_id) AS applicants
                FROM jobs
                LEFT JOIN jobseeker_job_apply ON jobs.id = jobseeker_job_apply.job_id
                WHERE jobs.employer_id = $1
                GROUP BY jobs.id
                ORDER BY jobs.created_at DESC
              `
            : `
                SELECT 
                    jobs.*, 
                    COUNT(jobseeker_job_apply.job_id) AS applicants
                FROM jobs
                LEFT JOIN jobseeker_job_apply ON jobs.id = jobseeker_job_apply.job_id
                GROUP BY jobs.id
                ORDER BY jobs.created_at DESC
              `;

        const values = employer_id ? [Number(employer_id)] : [];

        const result = await pool.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


//job update
const jobUpdateSchema = z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    employment_type: z.string().optional(),
    experience_level: z.string().optional(),
    salary: z.string().optional(),
    description: z.string().optional(),
    requirements: z.string().optional(),
    benefits: z.string().optional(),
    application_deadline: z.string().optional(),
    contact_email: z.string().email().optional(),
});
export const updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobId = parseInt(req.params.id);
        const data = jobUpdateSchema.parse(req.body);

        // Dynamically build SET clause
        const keys = Object.keys(data);
        const values = Object.values(data);

        if (keys.length === 0) {
            res.status(400).json({ error: "No fields to update" });
        }

        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

        const result = await pool.query(
            `UPDATE jobs SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, jobId]
        );

        res.status(200).json({ message: "Job updated", job: result.rows[0] });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        console.error("Error updating job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// delete job application
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobId = parseInt(req.params.id);

        const result = await pool.query("DELETE FROM jobs WHERE id = $1 RETURNING *", [jobId]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json({ message: "Job deleted", job: result.rows[0] });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getAllApplications = async (_: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT * FROM jobseeker_job_apply
            ORDER BY applied_at DESC
        `;

        const result = await pool.query(query);

        res.status(200).json({ applications: result.rows });
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
//employer data get only title,location ,employment_type,experience_level	

interface UserPayload {
    id: number;
    role: string;
    // add more fields if needed (e.g., email)
}

export interface RequestWithUser extends Request {
    user?: UserPayload;
}

export const jobseekersGetData = async (_req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            "SELECT id, title, location, employment_type, experience_level FROM jobs ORDER BY created_at DESC"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching job data for jobseekers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const getJobAnalytics = async (_: Request, res: Response): Promise<void> => {
    try {
        // 1. Jobs posted in the last 6 months by month
        const jobStatsQuery = `
            SELECT 
                TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
                COUNT(*) AS jobs
            FROM jobs
            WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY DATE_TRUNC('month', created_at);
        `;

        // 2. Applications submitted in the last 6 months by month
        const applicationStatsQuery = `
            SELECT 
                TO_CHAR(DATE_TRUNC('month', application_date), 'Mon') AS month,
                COUNT(*) AS applications
            FROM jobseeker_job_apply
            WHERE application_date >= CURRENT_DATE - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', application_date)
            ORDER BY DATE_TRUNC('month', application_date);
        `;

        // 3. Performance of the latest 5 jobs (ensure views column exists)
        const performanceQuery = `
    SELECT 
        j.title,
        0 AS views, -- fallback since column doesn't exist
        COUNT(a.id) AS applications,
        '0%' AS conversion_rate, -- since views is 0
        '12 days' AS time_to_fill,
        '$450' AS cost_per_hire
    FROM jobs j
    LEFT JOIN jobseeker_job_apply a ON j.id = a.job_id
    GROUP BY j.id
    ORDER BY j.created_at DESC
    LIMIT 5;
`;

        const [jobStats, appStats, performance] = await Promise.all([
            pool.query(jobStatsQuery),
            pool.query(applicationStatsQuery),
            pool.query(performanceQuery)
        ]);

        res.status(200).json({
            jobsPostedData: jobStats.rows,
            applicationsData: appStats.rows,
            jobPerformanceData: performance.rows
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};