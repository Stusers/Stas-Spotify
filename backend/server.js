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
        await db.query("DROP TABLE IF EXISTS sessions, clients, therapists");
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
        console.log(" Tables dropped.");

        await db.query(`
            CREATE TABLE therapists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                years_of_practice INT NOT NULL,
                availability ENUM('TAKING CLIENTS', 'NOT TAKING CLIENTS') NOT NULL,
                image_link VARCHAR(500)
            )
        `);
        console.log(" Therapists table created.");

        await db.query(`
            CREATE TABLE clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(100) NOT NULL,
                regularity ENUM('WEEKLY', 'MONTHLY') NOT NULL,
                image_link VARCHAR(500)
            )
        `);
        console.log(" Clients table created.");        await db.query(`
            CREATE TABLE sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                therapist_id INT NOT NULL,
                client_id INT NOT NULL,
                notes TEXT,
                date DATETIME NOT NULL,
                length_minutes INT NOT NULL,
                status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
                payment_status ENUM('PAID', 'PENDING', 'WAIVED') DEFAULT 'PENDING',
                image_link VARCHAR(500),
                FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE CASCADE,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            )
        `);
        console.log(" Sessions table created.");
    } catch (error) {
        console.error(" Error resetting database:", error);
    }
};
// Development only
const populateDatabase = async () => {
    try {
        console.log("Populating the database...");        const therapistData = [
            ["Dr.", "Jane Smith", "sarah@therapy.com", "New York", 15, "TAKING CLIENTS", "https://c8.alamy.com/comp/F0R3HB/funny-doctor-F0R3HB.jpg"],
            ["Dr.", "Robert Johnson", "michael@therapy.com", "Chicago", 20, "TAKING CLIENTS", "https://as2.ftcdn.net/jpg/00/49/82/59/1000_F_49825930_uOTi1tSc6gk8N8QNelAiSxUY5lxSRETB.jpg"],
            ["LMHC", "Lisa Ray", "david@therapy.com", "Boston", 8, "NOT TAKING CLIENTS", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9TbWOt6iKyX4edFFQD534jgJiFoOhgHpGVA&s"],
            ["Ph.D.", "Kevin Lee", "jennifer@therapy.com", "San Francisco", 12, "TAKING CLIENTS", "https://www.shutterstock.com/shutterstock/photos/186042329/display_1500/stock-photo-funny-young-doctor-man-with-stethoscope-on-white-background-186042329.jpg"],
            ["Dr.", "Gregory House", "robert@therapy.com", "Austin", 25, "TAKING CLIENTS", "https://preview.redd.it/houses-stare-reminds-me-of-my-fathers-look-when-he-turned-v0-f7u9kbn4b3ce1.png?auto=webp&s=b8fe5a39a8f9d737e9d15d8a490c94a5c68c6dc8"]
        ];
        await db.query("INSERT INTO therapists (title, name, email, location, years_of_practice, availability, image_link) VALUES ?", [therapistData]);
        console.log(" Therapists inserted.");        const clientData = [
            ["Mr Larry", "john.doe@email.com", "555-123-4567", "WEEKLY", "https://static.wikia.nocookie.net/impractical-jokers/images/3/31/4C179413-A671-4281-8AE6-3D7B92908A80.jpeg/revision/latest?cb=20200810212338"],
            ["Murr", "jane.smith@email.com", "555-234-5678", "MONTHLY", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCjW8iTHkhFmbc7SbTTCu_4dm-2Hpr6vE4AA&s"],
            ["Sophia Brown", "alex@email.com", "555-345-6789", "WEEKLY", "https://thumbs.dreamstime.com/b/funny-doctor-patient-4864539.jpg"],
            ["Michael Green", "maria@email.com", "555-456-7890", "WEEKLY", "https://thumbs.dreamstime.com/z/funny-patient-29200708.jpg"],
            ["Olivia Davis", "sam@email.com", "555-567-8901", "MONTHLY", "https://media.gettyimages.com/id/988688442/photo/medical-team-selfie-with-patient-in-operating-theatre.jpg?s=612x612&w=gi&k=20&c=jMx6ph6w2GVjylN9D6Tv_m5-61FWvRmgSlQACVX7cew="]
        ];
        await db.query("INSERT INTO clients (name, email, phone, regularity, image_link) VALUES ?", [clientData]);
        console.log(" Clients inserted.");        // Use current date and future dates for sessions
        const now = new Date();
        const formatDate = (date) => date.toISOString().slice(0, 19).replace('T', ' ');
        
        // Create dates for the next few days
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(now); dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        const nextWeek = new Date(now); nextWeek.setDate(nextWeek.getDate() + 7);          const sessionData = [
            [1, 1, "My Friend", formatDate(now), 60, "SCHEDULED", "PENDING", "https://media.timeout.com/images/106049236/750/562/image.jpg"],
            [2, 2, "Family Reunion", formatDate(tomorrow), 45, "SCHEDULED", "PENDING", "https://media.cnn.com/api/v1/images/stellar/prod/180516151635-catacombs-paris-france.jpg?q=w_2187,h_1458,x_0,y_0,c_fill"],
            [3, 3, "The Little One", formatDate(dayAfterTomorrow), 90, "SCHEDULED", "PAID", "https://media.timeout.com/images/105708529/750/562/image.jpg"],
            [4, 4, "Voices in the Walls", formatDate(nextWeek), 60, "COMPLETED", "PENDING", "https://media.architecturaldigest.com/photos/5da8da9a3baf780009fd936f/master/w_1600%2Cc_limit/GettyImages-453566466.jpg"],
            [5, 5, "Shadow People", formatDate(tomorrow), 45, "CANCELLED", "WAIVED", "https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,h_348,q_75,w_618/https://res.cloudinary.com/simpleview/image/upload/v1490231466/clients/newyorkstate/Rolling_Hills_Asylum_Antiquity_Echoes_Photo_Courtesy_of_Haunted_History_Trail_of_NYS_1033f83e-0084-42e4-a08c-e2202fefd845.jpg"]
        ];
        await db.query("INSERT INTO sessions (therapist_id, client_id, notes, date, length_minutes, status, payment_status, image_link) VALUES ?", [sessionData]);
        console.log(" Sessions inserted.");

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
