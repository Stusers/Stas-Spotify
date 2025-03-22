import mysql from 'mysql2';
import dotenv from 'dotenv';


dotenv.config();


//We make a lil pool so we connect all good

const pool = mysql.createPool({
    host: process.env.DB_HOST,     // e.g., 'localhost'
    user: process.env.DB_USER,     // e.g., 'root'
    password: process.env.DB_PASS, // e.g., 'password'
    database: process.env.DB_NAME, // e.g., 'music_app'
    waitForConnections: true,
    connectionLimit: 10, // Number of connections in the pool
    queueLimit: 0
});


const db = pool.promise();

export default db;
