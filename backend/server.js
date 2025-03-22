import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/dbConfig.js";
import apiRoutes from "./route/dbRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Stupid Cors error solved!
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());


app.use("/api", apiRoutes);


//dubug shiii
const testDBConnection = async () => {
    try {
        const [result] = await db.query("SELECT 1 + 1 AS solution");
        console.log(" MySQL Database Connected! Test Result:", result[0].solution);
    } catch (error) {
        console.error(" Database connection failed:", error);
        process.exit(1);
    }
};
testDBConnection();

// Development only
const resetDatabase = async () => {
    try {
        console.log("🔄 Dropping all tables...");
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
        await db.query("DROP TABLE IF EXISTS songs, albums, artists");
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        console.log(" Tables dropped.");

        await db.query(`
            CREATE TABLE artists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                monthly_listeners INT NOT NULL DEFAULT 0,
                genre VARCHAR(100) NOT NULL,
                image_link VARCHAR(500)
            )
        `);
        console.log(" Artists table created.");

        await db.query(`
            CREATE TABLE albums (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                artist_id INT NOT NULL,
                release_year INT NOT NULL,
                number_of_listens INT NOT NULL DEFAULT 0,
                image_link VARCHAR(500),
                FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
            )
        `);
        console.log(" Albums table created.");

        await db.query(`
            CREATE TABLE songs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                release_year INT NOT NULL,
                album_id INT NOT NULL,
                artist_id INT NOT NULL,
                image_link VARCHAR(500),
                FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
                FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
            )
        `);
        console.log(" Songs table created.");
    } catch (error) {
        console.error(" Error resetting database:", error);
    }
};
// Development only
const populateDatabase = async () => {
    try {
        console.log("Populating the database...");

        const artistData = [
            ["The Beatles", 25000000, "Rock", "https://c.files.bbci.co.uk/12649/production/_130073357_the_beatles_getty.jpg"],
            ["Michael Jackson", 30000000, "Pop", "https://i.redd.it/j77ubfmhim3d1.jpeg"],
            ["Eminem", 22000000, "Hip-Hop", "https://i.redd.it/eminem-pointing-to-the-camera-with-question-mark-restored-v0-vllsckakeaya1.jpg?width=710&format=pjpg&auto=webp&s=cf6f2dce44ad62e4fe0290d56536f044c1e3cc63"],
            ["Queen", 20000000, "Rock", "https://i.chzbgr.com/full/9202349824/hDFD302AF/i-want-answers-are-to-break-free-to-ride-my-bicycle-it-all-and-to-make-a-supersonic-man-out-of-you"],
            ["Beyoncé", 18000000, "R&B/Pop", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2NRlQ2rLWZ8zpmVEElYgvZ9Ksbz2Wmlor3w&s"],
            ["Drake", 25000000, "Hip-Hop", "https://www.telegraph.co.uk/content/dam/music/2016/11/30/drake_trans_NvBQzQNjv4BqZPnXlBHEdt8AtjizIYNgmZhw_iIPZqUNP2EjAIFcGyw.jpg?imwidth=680"]
        ];
        await db.query("INSERT INTO artists (name, monthly_listeners, genre, image_link) VALUES ?", [artistData]);
        console.log(" Artists inserted.");

        const albumData = [
            ["Abbey Road", 1, 1969, 50000000, "https://i.redd.it/o43bfutou6mc1.jpeg"],
            ["Thriller", 2, 1982, 66000000, "https://images1.memedroid.com/images/UPLOADED9/50775c1ccb76e.jpeg"],
            ["The Eminem Show", 3, 2002, 30000000, "https://i.imgflip.com/97l7d5.jpg"],
            ["A Night at the Opera", 4, 1975, 25000000, "https://i.scdn.co/image/ab67616d0000b2735a0356dd4c5822509208f525"],
            ["Lemonade", 5, 2016, 15000000, "https://images3.memedroid.com/images/UPLOADED646/66531ae061ad1.jpeg"],
            ["Scorpion", 6, 2018, 20000000, "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/02/mk11-covid.jpg"]
        ];
        await db.query("INSERT INTO albums (name, artist_id, release_year, number_of_listens, image_link) VALUES ?", [albumData]);
        console.log(" Albums inserted.");

        const songData = [
            ["Come Together", 1969, 1, 1, "https://en.meming.world/images/en/2/26/Oh_Yeah%2C_It%27s_All_Coming_Together.jpg"],
            ["Billie Jean", 1982, 2, 2, "https://i.redd.it/objopwsrvxj61.jpg"],
            ["Without Me", 2002, 3, 3, "https://media.tenor.com/Bk0UFLPIHPIAAAAM/nnn.gif"],
            ["Bohemian Rhapsody", 1975, 4, 4, "https://i.imgflip.com/92lbms.jpg"],
            ["Formation", 2016, 5, 5, "https://i.redd.it/vxsbkb7u7uo41.jpg"],
            ["God's Plan", 2018, 6, 6, "https://i.cbc.ca/1.5172842.1560370263!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_940/drake-god-s-plan.jpg"]
        ];
        await db.query("INSERT INTO songs (name, release_year, album_id, artist_id, image_link) VALUES ?", [songData]);
        console.log(" Songs inserted.");

    } catch (error) {
        console.error(" Error populating database:", error);
    }
}

//Comment these
await resetDatabase();
await populateDatabase();

app.get("/", (req, res) => {
    res.send("🎵 Music API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
