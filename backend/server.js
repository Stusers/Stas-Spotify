import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/dbConfig.js";
import authRoutes from "./route/authRoute.js";
import apiRoutes from "./route/dbRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());


app.use("/api/auth", authRoutes);


app.use("/api", apiRoutes);

// Test DB connection
const testDBConnection = async () => {
    try {
        const [result] = await db.query("SELECT 1 + 1 AS solution");
        console.log("MySQL connected, test result:", result[0].solution);
    } catch (err) {
        console.error("DB connection failed:", err);
        process.exit(1);
    }
};
testDBConnection();

// Development only: reset schema
const resetDatabase = async () => {
    try {
        console.log("🔄 Dropping tables...");
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await db.query("DROP TABLE IF EXISTS plans, logs, user");
        await db.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log("Creating 'user' table...");
        await db.query(`
      CREATE TABLE user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        hash_password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        image_link VARCHAR(500)
      )
    `);

        console.log("Creating 'logs' table...");
        await db.query(`
      CREATE TABLE logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        \`desc\` VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        post_date DATE NOT NULL,
        image_link VARCHAR(500),
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

        console.log("Creating 'plans' table...");
        await db.query(`
      CREATE TABLE plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        \`desc\` VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        end_date DATE NOT NULL,
        location VARCHAR(255) NOT NULL,
        image_link VARCHAR(500),
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

        console.log("Schema reset complete.");
    } catch (err) {
        console.error("Error resetting database:", err);
    }
};

// Development only: seed sample data
const populateDatabase = async () => {
    try {
        console.log("Seeding data...");

        // Users
        const users = [
            ['Alice', 'pass1', 'hash1', 'alice@example.com', null],
            ['Bob', 'pass2', 'hash2', 'bob@example.com', null],
            ['Charlie', 'pass3', 'hash3', 'charlie@example.com', null]
        ];
        await db.query(
            "INSERT INTO user (name, password, hash_password, email, image_link) VALUES ?",
            [users]
        );

        // Logs
        const logs = [
            ['Morning Run', '5km run', 1, '2025-04-01', '2025-04-01', '2025-04-01', null],
            ['Project Kickoff', 'Meeting', 2, '2025-03-15', '2025-03-15', '2025-03-15', null]
        ];
        await db.query(
            "INSERT INTO logs (name, `desc`, user_id, start_date, end_date, post_date, image_link) VALUES ?",
            [logs]
        );

        // Plans
        const plans = [
            ['Paris Trip', 'Visit Eiffel', 1, '2025-06-01', 'Paris', null],
            ['Conference', 'Tech conf', 2, '2025-09-15', 'Berlin', null]
        ];
        await db.query(
            "INSERT INTO plans (name, `desc`, user_id, end_date, location, image_link) VALUES ?",
            [plans]
        );

        console.log("Sample data inserted.");
    } catch (err) {
        console.error("Error seeding database:", err);
    }
};

// Run only in dev
//await resetDatabase();
//await populateDatabase();

// Root endpoint
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
