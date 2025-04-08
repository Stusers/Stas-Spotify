import express from "express";
import {
    getTherapists, getTherapistById, createTherapist, updateTherapist, deleteTherapist,
    getClients, getClientById, createClient, updateClient, deleteClient,
    getSessions, getSessionById, createSession, updateSession, deleteSession
} from "../controller/dbController.js";

const router = express.Router();

// Therapist Routes
router.get("/therapists", getTherapists);
router.get("/therapists/:id", getTherapistById);
router.post("/therapists", createTherapist);
router.put("/therapists/:id", updateTherapist);
router.delete("/therapists/:id", deleteTherapist);

// Client Routes
router.get("/clients", getClients);
router.get("/clients/:id", getClientById);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

// Session Routes
router.get("/sessions", getSessions);
router.get("/sessions/:id", getSessionById);
router.post("/sessions", createSession);
router.put("/sessions/:id", updateSession);
router.delete("/sessions/:id", deleteSession);

export default router;
