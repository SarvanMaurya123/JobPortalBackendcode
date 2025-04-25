import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import pool from '../../config/db';

const jobseekerSchema = z.object({
    user_id: z.number({ required_error: 'User ID is required' }),
    full_name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email format'),
    phone_number: z.string().min(10, 'Phone number is required'),
    location: z.string().optional(),
    interested_area: z.string().optional(),
    about: z.string().optional(),
    date_of_birth: z.string().optional(),
    resume_link: z.string().optional(),
});

const sendResponse = (
    res: Response,
    status: number,
    success: boolean,
    message: string,
    data?: any
): void => {
    res.status(status).json({ success, message, data });
};

export const createProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsed = jobseekerSchema.parse(req.body);
        const {
            user_id,
            full_name,
            email,
            phone_number,
            location,
            interested_area,
            about,
            date_of_birth,
            resume_link,
        } = parsed;

        const result = await pool.query(
            `INSERT INTO jobseeker_profiles (
                user_id, full_name, email, phone_number,
                location, interested_area, about,
                date_of_birth, resume_link
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                user_id,
                full_name,
                email,
                phone_number,
                location,
                interested_area,
                about,
                date_of_birth,
                resume_link,
            ]
        );

        sendResponse(res, 201, true, 'Profile created successfully', result.rows[0]);
    } catch (error) {
        if (error instanceof ZodError) {
            sendResponse(res, 400, false, 'Validation failed', error.flatten().fieldErrors);
        } else {
            console.error(error);
            sendResponse(res, 500, false, 'Internal server error');
        }
    }
};
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);

    try {
        const result = await pool.query(
            'SELECT * FROM jobseeker_profiles WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            sendResponse(res, 404, false, 'Profile not found');
            return;
        }

        sendResponse(res, 200, true, 'Profile fetched successfully', result.rows[0]);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, 'Internal server error');
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);

    try {
        const parsed = jobseekerSchema.parse({ ...req.body, user_id: userId });

        const {
            full_name,
            email,
            phone_number,
            location,
            interested_area,
            about,
            date_of_birth,
            resume_link,
        } = parsed;

        const result = await pool.query(
            `UPDATE jobseeker_profiles SET
        full_name = $1,
        email = $2,
        phone_number = $3,
        location = $4,
        interested_area = $5,
        about = $6,
        date_of_birth = $7,
        resume_link = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $9
      RETURNING *`,
            [
                full_name,
                email,
                phone_number,
                location,
                interested_area,
                about,
                date_of_birth,
                resume_link,
                userId,
            ]
        );

        if (result.rows.length === 0) {
            sendResponse(res, 404, false, 'Profile not found');
            return;
        }

        sendResponse(res, 200, true, 'Profile updated successfully', result.rows[0]);
    } catch (error) {
        if (error instanceof ZodError) {
            sendResponse(res, 400, false, 'Validation failed', error.flatten().fieldErrors);
        } else {
            console.error(error);
            sendResponse(res, 500, false, 'Internal server error');
        }
    }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId);

    try {
        const result = await pool.query(
            'DELETE FROM jobseeker_profiles WHERE user_id = $1 RETURNING *',
            [userId]
        );

        if (result.rows.length === 0) {
            sendResponse(res, 404, false, 'Profile not found');
            return;
        }

        sendResponse(res, 200, true, 'Profile deleted successfully');
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, false, 'Internal server error');
    }
};
