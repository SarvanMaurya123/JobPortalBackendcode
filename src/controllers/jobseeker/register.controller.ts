import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import pool from "../../config/db";
import { sendWelcomeEmail } from "../../utils/email"; // Import the email function

// Validation Schema
const userSchema = z
    .object({
        full_name: z.string().min(3, "Full name must be at least 3 characters long"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string(),
        phone: z.string().optional(),
        linked_in: z.string().url("Invalid LinkedIn URL").optional(),
        portfolio: z.string().url("Invalid Portfolio URL").optional(),
        terms_accepted: z.boolean().refine((value) => value === true, {
            message: "You must accept the terms and conditions",
        }),
        role: z.enum(["user"]).default("user") // Add role validation
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const registerUser = async (
    req: Request,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    let client;
    try {
        // Validate input
        const validatedData = userSchema.parse(req.body);
        const { full_name, email, password, phone, linked_in, portfolio, terms_accepted, role } = validatedData;

        client = await pool.connect();

        // Check if user already exists
        const result = await client.query("SELECT 1 FROM users WHERE email = $1", [email]);
        if (result.rowCount && result.rowCount > 0) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into PostgreSQL
        const { rows } = await client.query(
            `INSERT INTO users (full_name, email, password, phone, linked_in, portfolio, terms_accepted, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [full_name, email, hashedPassword, phone, linked_in, portfolio, terms_accepted, role]
        );

        // Send Welcome Email
        await sendWelcomeEmail(email, full_name);

        res.status(201).json({
            message: "User registered successfully. A welcome email has been sent.",
            user: rows[0],
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Validation failed", errors: error.errors });
        } else {
            console.error("Registration Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    } finally {
        if (client) client.release();
    }
};
