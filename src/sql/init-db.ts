import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import pool from "../config/db";

dotenv.config();

const runMigrations = async () => {
    const sqlDir = path.join(__dirname);
    const files = fs.readdirSync(sqlDir).filter(file => file.endsWith(".sql"));

    const client = await pool.connect();

    try {
        for (const file of files) {
            const filePath = path.join(sqlDir, file);
            const sql = fs.readFileSync(filePath, "utf8");
            await client.query(sql);
            console.log(`✅ Executed: ${file}`);
        }
    } catch (error) {
        console.error("❌ Migration Error:", error);
    } finally {
        client.release();
        process.exit(0);
    }
};

runMigrations();
