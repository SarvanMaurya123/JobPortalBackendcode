import { Request, Response } from "express";
import pool from "../../config/db";

export const getFullResumeData = async (req: Request, res: Response): Promise<void> => {
    const { profileId, userId } = req.params;

    try {
        const [basicInfoResult, educationResult, experienceResult, skillsResult, userResult] = await Promise.all([
            pool.query("SELECT * FROM jobseeker_profiles WHERE id = $1", [profileId]),
            pool.query("SELECT * FROM jobseeker_education WHERE jobseeker_profile_id = $1", [profileId]),
            pool.query("SELECT * FROM jobseeker_experience WHERE jobseeker_profile_id = $1", [profileId]),
            pool.query("SELECT * FROM jobseeker_skills WHERE jobseeker_profile_id = $1", [profileId]),
            pool.query("SELECT  linked_in, portfolio FROM users WHERE id = $1", [userId]),
        ]);

        const basicInfo = basicInfoResult.rows[0] || {};
        const education = educationResult.rows || [];
        const experience = experienceResult.rows || [];
        const skills = skillsResult.rows || [];
        const user = userResult.rows[0] || {};

        const resumeData = {
            personalInfo: {
                full_name: user.full_name || basicInfo.full_name,
                email: user.email || basicInfo.email,
                phone_number: user.phone || basicInfo.phone_number,
                linked_in: user.linked_in || null,
                portfolio: user.portfolio || null,
                location: basicInfo.location,
                date_of_birth: basicInfo.date_of_birth,
            },
            about: basicInfo.about || null,
            resume_link: basicInfo.resume_link || null,
            education: education.map(ed => ({
                institution: ed.institution_name,
                degree: ed.degree,
                field_of_study: ed.field_of_study,
                start_year: ed.start_year,
                end_year: ed.end_year,
                grade_or_percentage: ed.grade_or_percentage,
            })),
            experience: experience.map(exp => ({
                company: exp.company_name,
                title: exp.job_title,
                start_date: exp.start_date,
                end_date: exp.end_date,
                description: exp.description,
            })),
            skills: skills.map(skill => ({
                name: skill.skill_name,
                proficiency: skill.proficiency,
            })),
        };

        res.status(200).json({
            success: true,
            message: "Resume data fetched successfully",
            data: resumeData,
        });

    } catch (error) {
        console.error("Error fetching resume data:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
