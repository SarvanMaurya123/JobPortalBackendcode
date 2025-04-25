import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Neon
    },
});

pool.query('SELECT 1')
    .then(() => console.log("✅ Connected to Neon PostgreSQL"))
    .catch((error: Error) => console.error("❌ Database Connection Error:", error));

// Optional: Keep-alive ping in development
if (process.env.NODE_ENV === 'development') {
    setInterval(async () => {
        try {
            await pool.query('SELECT 1');
            console.log('🔁 Keep-alive ping to DB');
        } catch (err) {
            console.error('❌ Keep-alive DB ping failed', err);
        }
    }, 240000); // every 4 mins
}

export default pool;
