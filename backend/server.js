import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/dbConfig.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Test Database Connection
const testDBConnection = async () => {
    try {
        const [result] = await db.query("SELECT 1 + 1 AS solution");
        console.log("✅ MySQL Database Connected! Test Result:", result[0].solution);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};
testDBConnection();

// ⬇️ Function to Reset and Populate Database ⬇️
const resetDatabase = async () => {
    try {
        console.log("🔄 Dropping all tables...");
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await db.query("DROP TABLE IF EXISTS songs, albums, artists");
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        console.log("✅ Tables dropped successfully.");

        await db.query(`
            CREATE TABLE artists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                monthly_listeners INT NOT NULL DEFAULT 0,
                genre VARCHAR(100) NOT NULL,
                image_link VARCHAR(500) NULL
            )
        `);
        console.log("✅ Artists table created.");

        await db.query(`
            CREATE TABLE albums (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                artist_id INT NOT NULL,
                release_year INT NOT NULL,
                number_of_listens INT NOT NULL DEFAULT 0,
                image_link VARCHAR(500) NULL,
                FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Albums table created.");

        await db.query(`
            CREATE TABLE songs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                release_year INT NOT NULL,
                album_id INT NOT NULL,
                artist_id INT NOT NULL,
                image_link VARCHAR(500) NULL,
                FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
                FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Songs table created.");

        console.log("🎵 Database reset successfully!");
    } catch (error) {
        console.error("❌ Error resetting database:", error);
    }
};

const populateDatabase = async () => {
    try {
        console.log("🌟 Populating the database with artists, albums, and songs...");

        const artistData = [
            ["The Beatles", 25000000, "Rock", "https://upload.wikimedia.org/wikipedia/en/6/6d/The_Beatles_-_Abbey_Road.jpg"],
            ["Michael Jackson", 30000000, "Pop", "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_Dangerous.png"],
            ["Eminem", 22000000, "Hip-Hop", "https://upload.wikimedia.org/wikipedia/en/3/35/The_Eminem_Show.jpg"],
            ["Queen", 20000000, "Rock", "https://upload.wikimedia.org/wikipedia/en/0/01/Queen_A_Night_At_The_Opera.png"],
            ["Beyoncé", 18000000, "R&B/Pop", "https://upload.wikimedia.org/wikipedia/en/c/c4/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png"],
            ["Drake", 25000000, "Hip-Hop", "https://upload.wikimedia.org/wikipedia/en/a/af/Drake_-_Scorpion.png"]
        ];
        await db.query("INSERT INTO artists (name, monthly_listeners, genre, image_link) VALUES ?", [artistData]);
        console.log("✅ Artists inserted successfully.");

        const albumData = [
            ["Abbey Road", 1, 1969, 50000000, "https://upload.wikimedia.org/wikipedia/en/6/6d/The_Beatles_-_Abbey_Road.jpg"],
            ["Thriller", 2, 1982, 66000000, "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_Dangerous.png"],
            ["The Eminem Show", 3, 2002, 30000000, "https://upload.wikimedia.org/wikipedia/en/3/35/The_Eminem_Show.jpg"],
            ["A Night at the Opera", 4, 1975, 25000000, "https://upload.wikimedia.org/wikipedia/en/0/01/Queen_A_Night_At_The_Opera.png"],
            ["Lemonade", 5, 2016, 15000000, "https://upload.wikimedia.org/wikipedia/en/c/c4/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png"],
            ["Scorpion", 6, 2018, 20000000, "https://upload.wikimedia.org/wikipedia/en/a/af/Drake_-_Scorpion.png"]
        ];
        await db.query("INSERT INTO albums (name, artist_id, release_year, number_of_listens, image_link) VALUES ?", [albumData]);
        console.log("✅ Albums inserted successfully.");

        const songData = [
            ["Come Together", 1969, 1, 1, "https://upload.wikimedia.org/wikipedia/en/6/6d/The_Beatles_-_Abbey_Road.jpg"],
            ["Billie Jean", 1982, 2, 2, "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_Dangerous.png"],
            ["Without Me", 2002, 3, 3, "https://upload.wikimedia.org/wikipedia/en/3/35/The_Eminem_Show.jpg"],
            ["Bohemian Rhapsody", 1975, 4, 4, "https://upload.wikimedia.org/wikipedia/en/0/01/Queen_A_Night_At_The_Opera.png"],
            ["Formation", 2016, 5, 5, "https://upload.wikimedia.org/wikipedia/en/c/c4/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png"],
            ["God's Plan", 2018, 6, 6, "https://upload.wikimedia.org/wikipedia/en/a/af/Drake_-_Scorpion.png"]
        ];
        await db.query("INSERT INTO songs (name, release_year, album_id, artist_id, image_link) VALUES ?", [songData]);
        console.log("✅ Songs inserted successfully.");

        console.log("🎵 Database populated successfully!");
    } catch (error) {
        console.error("❌ Error populating database:", error);
    }
};

// ⬇️ Uncomment these functions if you want to reset & populate the database on startup ⬇️
await resetDatabase();
await populateDatabase();

app.get("/", (req, res) => {
    res.send("🎵 Music API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
