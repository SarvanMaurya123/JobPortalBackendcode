import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

interface AuthenticatedRequest extends Request {
    employer?: any;
}

const verifyEmployerJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token = req.cookies?.accessToken;

        if (!token) {
            token = req.header('Authorization')?.replace('Bearer ', '');
        }

        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing accessToken' });
            return;
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as DecodedToken;

        if (!decodedToken) {
            res.status(401).json({ message: 'Unauthorized: Invalid accessToken' });
            return;
        }

        // Fetch employer from PostgreSQL database
        const { rows } = await pool.query('SELECT id, first_name, email,role FROM employers WHERE id = $1', [decodedToken.id]);

        if (!rows.length) {
            res.status(401).json({ message: 'Unauthorized: employer not found' });
            return;
        }

        req.employer = rows[0]; // Attaching employer data to request object
        next();
    } catch (error: any) {
        console.error('JWT Verification Error:', error);

        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Unauthorized: AccessToken expired' });
            return;
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Unauthorized: Invalid accessToken' });
            return;
        } else {
            res.status(401).json({ message: 'Unauthorized: Authentication error' });
            return
        }
    }
};

export default verifyEmployerJWT;
