import db from "../config/dbConfig.js";


export const getTherapists = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM therapists");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching therapists:", error);
        res.status(500).json({ message: "Error fetching therapists" });
    }
};


export const getTherapistById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM therapists WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Therapist not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching therapist:", error);
        res.status(500).json({ message: "Error fetching therapist" });
    }
};


export const createTherapist = async (req, res) => {
    try {
        const { title, name, email, location, years_of_practice, availability, image_link } = req.body;
        await db.query("INSERT INTO therapists (title, name, email, location, years_of_practice, availability, image_link) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [title, name, email, location, years_of_practice, availability, image_link]
        );
        res.status(201).json({ message: "Therapist created successfully" });
    } catch (error) {
        console.error("Error creating therapist:", error);
        res.status(500).json({ message: "Error creating therapist" });
    }
};


export const updateTherapist = async (req, res) => {
    try {
        const { title, name, email, location, years_of_practice, availability, image_link } = req.body;
        await db.query("UPDATE therapists SET title=?, name=?, email=?, location=?, years_of_practice=?, availability=?, image_link=? WHERE id=?",
            [title, name, email, location, years_of_practice, availability, image_link, req.params.id]
        );
        res.json({ message: "Therapist updated successfully" });
    } catch (error) {
        console.error("Error updating therapist:", error);
        res.status(500).json({ message: "Error updating therapist" });
    }
};


export const deleteTherapist = async (req, res) => {
    try {
        await db.query("DELETE FROM therapists WHERE id = ?", [req.params.id]);
        res.json({ message: "Therapist deleted successfully" });
    } catch (error) {
        console.error("Error deleting therapist:", error);
        res.status(500).json({ message: "Error deleting therapist" });
    }
};

export const getClients = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM clients");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ message: "Error fetching clients" });
    }
};

export const getClientById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM clients WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Client not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching client:", error);
        res.status(500).json({ message: "Error fetching client" });
    }
};

export const createClient = async (req, res) => {
    try {
        const { name, email, phone, regularity, image_link } = req.body;
        await db.query("INSERT INTO clients (name, email, phone, regularity, image_link) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, regularity, image_link]
        );
        res.status(201).json({ message: "Client created successfully" });
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(500).json({ message: "Error creating client" });
    }
};

export const updateClient = async (req, res) => {
    try {
        const { name, email, phone, regularity, image_link } = req.body;
        await db.query("UPDATE clients SET name=?, email=?, phone=?, regularity=?, image_link=? WHERE id=?",
            [name, email, phone, regularity, image_link, req.params.id]
        );
        res.json({ message: "Client updated successfully" });
    } catch (error) {
        console.error("Error updating client:", error);
        res.status(500).json({ message: "Error updating client" });
    }
};

export const deleteClient = async (req, res) => {
    try {
        await db.query("DELETE FROM clients WHERE id = ?", [req.params.id]);
        res.json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({ message: "Error deleting client" });
    }
};

export const getSessions = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM sessions");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ message: "Error fetching sessions" });
    }
};

export const getSessionById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM sessions WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Session not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({ message: "Error fetching session" });
    }
};

export const createSession = async (req, res) => {
    try {
        const { therapist_id, client_id, notes, date, length_minutes, status, payment_status, image_link } = req.body;
        
        // Validate date format
        let formattedDate;
        
        try {
            // Check if the input date is in DD/MM/YYYY format
            if (date && typeof date === 'string' && date.includes('/')) {
                // Convert from DD/MM/YYYY to YYYY-MM-DD format
                const [day, month, year] = date.split('/');
                if (day && month && year) {
                    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    if (date.includes(' ')) {
                        // Add time if provided
                        formattedDate += ' ' + date.split(' ')[1];
                    } else {
                        // Add default time if not provided
                        formattedDate += ' 00:00:00';
                    }
                } else {
                    throw new Error("Invalid date format");
                }
            } else {
                // Assume it's already in correct format or handle ISO format
                formattedDate = date;
            }
            
            // Validate session status
            const validStatus = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];
            const sessionStatus = validStatus.includes(status) ? status : 'SCHEDULED';
            
            // Validate payment status
            const validPaymentStatus = ['PAID', 'PENDING', 'WAIVED'];
            const paymentStatus = validPaymentStatus.includes(payment_status) ? payment_status : 'PENDING';
            
            await db.query("INSERT INTO sessions (therapist_id, client_id, notes, date, length_minutes, status, payment_status, image_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [therapist_id, client_id, notes, formattedDate, length_minutes, sessionStatus, paymentStatus, image_link]
            );
            
            res.status(201).json({ message: "Session created successfully" });
        } catch (dateError) {
            // Send a helpful error message specifically for date issues
            return res.status(400).json({ 
                message: "Invalid date format. Please use YYYY-MM-DD HH:MM:SS format.",
                details: "Example: 2025-04-08 14:30:00"
            });
        }
    } catch (error) {
        console.error("Error creating session:", error);
        
        // Provide more specific error messages based on error type
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
            return res.status(400).json({ 
                message: "Invalid date format. MySQL requires format: YYYY-MM-DD HH:MM:SS",
                details: error.sqlMessage
            });
        }
        
        res.status(500).json({ 
            message: "Error creating session", 
            details: error.sqlMessage || error.message
        });
    }
};

export const updateSession = async (req, res) => {
    try {
        const { therapist_id, client_id, notes, date, length_minutes, status, payment_status, image_link } = req.body;
        await db.query("UPDATE sessions SET therapist_id=?, client_id=?, notes=?, date=?, length_minutes=?, status=?, payment_status=?, image_link=? WHERE id=?",
            [therapist_id, client_id, notes, date, length_minutes, status, payment_status, image_link, req.params.id]
        );
        res.json({ message: "Session updated successfully" });
    } catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({ message: "Error updating session" });
    }
};

export const deleteSession = async (req, res) => {
    try {
        await db.query("DELETE FROM sessions WHERE id = ?", [req.params.id]);
        res.json({ message: "Session deleted successfully" });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ message: "Error deleting session" });
    }
};
