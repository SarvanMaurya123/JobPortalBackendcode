import { Request, Response } from 'express'
import { z } from 'zod'
import pool from '../../config/db'

// Zod validation schema
const SkillSchema = z.object({
    jobseeker_profile_id: z.number(),
    skill_name: z.string().min(1, 'Skill name is required'),
    proficiency: z.string().optional()
})

// Get all skills for a jobseeker
export const getSkills = async (req: Request, res: Response): Promise<void> => {
    const { jobseekerId } = req.params

    try {
        const result = await pool.query(
            'SELECT * FROM jobseeker_skills WHERE jobseeker_profile_id = $1',
            [jobseekerId]
        )
        res.status(200).json({ success: true, data: result.rows })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

// Create a new skill
export const createSkill = async (req: Request, res: Response): Promise<void> => {
    const parsed = SkillSchema.safeParse(req.body)

    if (!parsed.success) {
        res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors })
        return
    }

    const { jobseeker_profile_id, skill_name, proficiency } = parsed.data

    try {
        // ✅ Check if the jobseeker profile exists
        const profileCheck = await pool.query(
            'SELECT id FROM jobseeker_profiles WHERE id = $1',
            [jobseeker_profile_id]
        )

        if (profileCheck.rowCount === 0) {
            res.status(400).json({ success: false, message: 'Invalid jobseeker profile ID' })
            return
        }

        // ✅ Insert the skill if profile exists
        const result = await pool.query(
            'INSERT INTO jobseeker_skills (jobseeker_profile_id, skill_name, proficiency) VALUES ($1, $2, $3) RETURNING *',
            [jobseeker_profile_id, skill_name, proficiency || 'Beginner']
        )

        res.status(201).json({ success: true, data: result.rows[0] })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}

// Delete a skill
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        await pool.query('DELETE FROM jobseeker_skills WHERE id = $1', [id])
        res.status(200).json({ success: true, message: 'Skill deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Server Error' })
    }
}
