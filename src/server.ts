// import dotenv from "dotenv";
// import pool from "./config/db";
// import app from "./app";

// dotenv.config(); // Ensure .env is correctly loaded

// const PORT = process.env.PORT || 3000;

// // Check database connection before starting the server
// pool.connect()
//     .then(() => {
//         console.log("✅ Connected to PostgreSQL");

//         app.listen(PORT, () => {
//             console.log(`🚀 Server running on http://localhost:${PORT}`);
//         });
//     })
//     .catch((error: Error) => {
//         console.error("❌ PostgreSQL Connection Failed:", error);
//     });



import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
