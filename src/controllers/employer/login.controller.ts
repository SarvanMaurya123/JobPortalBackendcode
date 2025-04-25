import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import pool from '../../config/db';

// Define the login schema using Zod
const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

interface JwtPayload {
    id: string;
    iat?: number;
    exp?: number;
}

const generateToken = (id: string | number): string => {
    const employer_id = String(id); // convert to string to ensure valid JWT audience

    const payload: JwtPayload = { id: employer_id };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
        algorithm: "HS256",
        expiresIn: "10h",
        issuer: "Job Portal",
        audience: employer_id, // Must be string or string[]
    });
};


export const loginemployer = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body with Zod
        const parsedData = loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ message: parsedData.error.errors });
            return;
        }

        const { email, password } = parsedData.data;

        // Check if employer exists in the database
        const { rows } = await pool.query('SELECT * FROM employers WHERE email = $1', [email]);

        if (rows.length === 0) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const employer = rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // Generate JWT token
        const token = generateToken(employer.id);

        // Set token in cookies
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            employer: {
                id: employer.id,
                first_name: employer.first_name, // fix here
                email: employer.email,
                role: employer.role,
            },
        });
        return;

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
