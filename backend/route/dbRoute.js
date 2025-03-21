import express from "express";
import {
    getArtists, getArtistById, createArtist, updateArtist, deleteArtist,
    getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum,
    getSongs, getSongById, createSong, updateSong, deleteSong
} from "../controller/dbController.js";

const router = express.Router();

// Artist Routes
router.get("/artists", getArtists);
router.get("/artists/:id", getArtistById);
router.post("/artists", createArtist);
router.put("/artists/:id", updateArtist);
router.delete("/artists/:id", deleteArtist);

// Album Routes
router.get("/albums", getAlbums);
router.get("/albums/:id", getAlbumById);
router.post("/albums", createAlbum);
router.put("/albums/:id", updateAlbum);
router.delete("/albums/:id", deleteAlbum);

// Song Routes
router.get("/songs", getSongs);
router.get("/songs/:id", getSongById);
router.post("/songs", createSong);
router.put("/songs/:id", updateSong);
router.delete("/songs/:id", deleteSong);

export default router;
