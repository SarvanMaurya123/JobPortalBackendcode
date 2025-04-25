import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import pool from "../../config/db";
import { sendWelcomeEmail } from "../../utils/email";

// Validation Schema
const userSchema = z
    .object({
        first_name: z.string().min(3),
        last_name: z.string().min(3),
        email: z.string().email(),
        phone: z.string().max(10, "Phone number must be 15 characters or less").max(13).optional(),
        password: z.string().min(6),
        confirmPassword: z.string(),
        date_of_birth: z.string().optional(),
        gender: z.string(),
        terms_accepted: z.boolean().refine((val) => val === true, {
            message: "You must accept the terms",
        }),
        role: z.enum(["employer"]).default("employer"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const registeremployer = async (req: Request, res: Response, _next: NextFunction) => {
    let client;
    try {
        const validatedData = userSchema.parse(req.body);
        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            date_of_birth,
            gender,
            terms_accepted,
            role,
        } = validatedData;

        client = await pool.connect();

        // Check existing user
        const result = await client.query("SELECT 1 FROM employers WHERE email = $1", [email]);
        if (result.rowCount && result.rowCount > 0) {
            res.status(400).json({ message: "employer already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
      INSERT INTO employers 
      (first_name, last_name, email, phone, password, date_of_birth, gender, terms_accepted, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
        const insertValues = [
            first_name,
            last_name,
            email,
            phone || null,
            hashedPassword,
            date_of_birth || null,
            gender,
            terms_accepted,
            role,
        ];

        const { rows } = await client.query(insertQuery, insertValues);

        await sendWelcomeEmail(email, first_name); // Adjust as per your function

        res.status(201).json({
            message: "Employer registered successfully",
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
