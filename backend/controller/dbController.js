import db from "../config/dbConfig.js"; // Import MySQL connection

//
// ─── ARTIST CONTROLLERS ───────────────────────────────────────────────────────
//

// Get all artists
export const getArtists = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM artists");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching artists:", error);
        res.status(500).json({ message: "Error fetching artists" });
    }
};

// Get a single artist by ID
export const getArtistById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM artists WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Artist not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching artist:", error);
        res.status(500).json({ message: "Error fetching artist" });
    }
};

// Create a new artist
export const createArtist = async (req, res) => {
    try {
        const { name, monthly_listeners, genre, image_link } = req.body;
        await db.query("INSERT INTO artists (name, monthly_listeners, genre, image_link) VALUES (?, ?, ?, ?)",
            [name, monthly_listeners, genre, image_link]
        );
        res.status(201).json({ message: "Artist created successfully" });
    } catch (error) {
        console.error("Error creating artist:", error);
        res.status(500).json({ message: "Error creating artist" });
    }
};

// Update an artist
export const updateArtist = async (req, res) => {
    try {
        const { name, monthly_listeners, genre, image_link } = req.body;
        await db.query("UPDATE artists SET name=?, monthly_listeners=?, genre=?, image_link=? WHERE id=?",
            [name, monthly_listeners, genre, image_link, req.params.id]
        );
        res.json({ message: "Artist updated successfully" });
    } catch (error) {
        console.error("Error updating artist:", error);
        res.status(500).json({ message: "Error updating artist" });
    }
};

// Delete an artist
export const deleteArtist = async (req, res) => {
    try {
        await db.query("DELETE FROM artists WHERE id = ?", [req.params.id]);
        res.json({ message: "Artist deleted successfully" });
    } catch (error) {
        console.error("Error deleting artist:", error);
        res.status(500).json({ message: "Error deleting artist" });
    }
};

//
// ─── ALBUM CONTROLLERS ────────────────────────────────────────────────────────
//

// Get all albums
export const getAlbums = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM albums");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching albums:", error);
        res.status(500).json({ message: "Error fetching albums" });
    }
};

// Get a single album by ID
export const getAlbumById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Album not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching album:", error);
        res.status(500).json({ message: "Error fetching album" });
    }
};

// Create a new album
export const createAlbum = async (req, res) => {
    try {
        const { name, artist_id, release_year, number_of_listens, image_link } = req.body;
        await db.query("INSERT INTO albums (name, artist_id, release_year, number_of_listens, image_link) VALUES (?, ?, ?, ?, ?)",
            [name, artist_id, release_year, number_of_listens, image_link]
        );
        res.status(201).json({ message: "Album created successfully" });
    } catch (error) {
        console.error("Error creating album:", error);
        res.status(500).json({ message: "Error creating album" });
    }
};

// Update an album
export const updateAlbum = async (req, res) => {
    try {
        const { name, artist_id, release_year, number_of_listens, image_link } = req.body;
        await db.query("UPDATE albums SET name=?, artist_id=?, release_year=?, number_of_listens=?, image_link=? WHERE id=?",
            [name, artist_id, release_year, number_of_listens, image_link, req.params.id]
        );
        res.json({ message: "Album updated successfully" });
    } catch (error) {
        console.error("Error updating album:", error);
        res.status(500).json({ message: "Error updating album" });
    }
};

// Delete an album
export const deleteAlbum = async (req, res) => {
    try {
        await db.query("DELETE FROM albums WHERE id = ?", [req.params.id]);
        res.json({ message: "Album deleted successfully" });
    } catch (error) {
        console.error("Error deleting album:", error);
        res.status(500).json({ message: "Error deleting album" });
    }
};

//
// ─── SONG CONTROLLERS ─────────────────────────────────────────────────────────
//

// Get all songs
export const getSongs = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM songs");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ message: "Error fetching songs" });
    }
};

// Get a single song by ID
export const getSongById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM songs WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Song not found" });
        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching song:", error);
        res.status(500).json({ message: "Error fetching song" });
    }
};

// Create a new song
export const createSong = async (req, res) => {
    try {
        const { name, release_year, album_id, artist_id, image_link } = req.body;
        await db.query("INSERT INTO songs (name, release_year, album_id, artist_id, image_link) VALUES (?, ?, ?, ?, ?)",
            [name, release_year, album_id, artist_id, image_link]
        );
        res.status(201).json({ message: "Song created successfully" });
    } catch (error) {
        console.error("Error creating song:", error);
        res.status(500).json({ message: "Error creating song" });
    }
};

// Update a song
export const updateSong = async (req, res) => {
    try {
        const { name, release_year, album_id, artist_id, image_link } = req.body;
        await db.query("UPDATE songs SET name=?, release_year=?, album_id=?, artist_id=?, image_link=? WHERE id=?",
            [name, release_year, album_id, artist_id, image_link, req.params.id]
        );
        res.json({ message: "Song updated successfully" });
    } catch (error) {
        console.error("Error updating song:", error);
        res.status(500).json({ message: "Error updating song" });
    }
};

// Delete a song
export const deleteSong = async (req, res) => {
    try {
        await db.query("DELETE FROM songs WHERE id = ?", [req.params.id]);
        res.json({ message: "Song deleted successfully" });
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ message: "Error deleting song" });
    }
};
