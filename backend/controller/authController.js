import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/dbConfig.js';
import dotenv from "dotenv";

dotenv.config();



// User registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        // Store hash in both password and hash_password columns for compatibility
        const [result] = await db.query(
            'INSERT INTO user (name, password, hash_password, email) VALUES (?, ?, ?, ?)',
            [name, hash, hash, email]
        );
        res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// User login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const [rows] = await db.query(
            'SELECT id, name, hash_password FROM user WHERE email = ?',
            [email]
        );
        if (!rows.length) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = rows[0];
        const valid = await bcrypt.compare(password, user.hash_password);
        if (!valid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, name: user.name, email } });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
