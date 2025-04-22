import db from "../config/dbConfig.js";

// Fetch a single user by ID
export const GetUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT id, name, email, image_link FROM user WHERE id = ?",
            [id]
        );
        if (!rows.length) return res.status(404).json({ message: "User not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Error retrieving user" });
    }
};

// Create a new user (open endpoint)
export const CreateUser = async (req, res) => {
    const { name, password, email, image_link } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO user (name, password, hash_password, email, image_link) VALUES (?, ?, ?, ?, ?)",
            [name, password, password, email, image_link]
        );
        res.status(201).json({ id: result.insertId, name, email, image_link });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
};

// Fetch logs for authenticated user
export const GetLogsByUserId = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            "SELECT id, name, `desc` AS logdesc, start_date, end_date, post_date, image_link FROM logs WHERE user_id = ? ORDER BY post_date DESC",
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error retrieving logs:", error);
        res.status(500).json({ message: "Error retrieving logs" });
    }
};

// Create a log for authenticated user
export const CreateLog = async (req, res) => {
    const userId = req.user.id;
    const { name, logdesc, start_date, end_date, post_date, image_link } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO logs (name, `desc`, user_id, start_date, end_date, post_date, image_link) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, logdesc, userId, start_date, end_date, post_date, image_link]
        );
        res.status(201).json({ id: result.insertId, name, logdesc, start_date, end_date, post_date, image_link });
    } catch (error) {
        console.error("Error creating log:", error);
        res.status(500).json({ message: "Error creating log" });
    }
};

// Update a log by ID
export const UpdateLog = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, logdesc, start_date, end_date, post_date, image_link } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE logs SET name = ?, `desc` = ?, start_date = ?, end_date = ?, post_date = ?, image_link = ? WHERE id = ? AND user_id = ?",
            [name, logdesc, start_date, end_date, post_date, image_link, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Log not found or not owned by user" });
        }

        res.json({ id: Number(id), name, logdesc, start_date, end_date, post_date, image_link });
    } catch (error) {
        console.error("Error updating log:", error);
        res.status(500).json({ message: "Error updating log" });
    }
};

// Delete a log by ID
export const DeleteLog = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM logs WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Log not found" });
        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting log:", error);
        res.status(500).json({ message: "Error deleting log" });
    }
};

// Fetch plans for authenticated user
export const GetPlansByUserId = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            "SELECT id, name, `desc` AS planDesc, end_date, location, image_link FROM plans WHERE user_id = ? ORDER BY end_date",
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error retrieving plans:", error);
        res.status(500).json({ message: "Error retrieving plans" });
    }
};

// Create a plan for authenticated user
export const CreatePlan = async (req, res) => {
    const userId = req.user.id;
    const { name, desc, end_date, location, image_link } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO plans (name, `desc`, user_id, end_date, location, image_link) VALUES (?, ?, ?, ?, ?, ?)",
            [name, desc, userId, end_date, location, image_link]
        );
        res.status(201).json({ id: result.insertId, name, desc, end_date, location, image_link });
    } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).json({ message: "Error creating plan" });
    }
};

// ✅ Update a plan by ID with fallback for desc
export const UpdatePlan = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const {
        name = '',
        desc = '',
        end_date = null,
        location = null,
        image_link = null
    } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE plans SET name = ?, `desc` = ?, end_date = ?, location = ?, image_link = ? WHERE id = ? AND user_id = ?",
            [name.trim(), desc.trim(), end_date, location, image_link, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Plan not found or not owned by user" });
        }

        res.json({ id: Number(id), name, desc, end_date, location, image_link });
    } catch (error) {
        console.error("Error updating plan:", error);
        res.status(500).json({ message: "Error updating plan" });
    }
};



// Delete a plan by ID
export const DeletePlan = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM plans WHERE id = ?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Plan not found" });
        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting plan:", error);
        res.status(500).json({ message: "Error deleting plan" });
    }
};
