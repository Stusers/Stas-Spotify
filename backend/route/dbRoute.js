// route/dbRoute.js
import express from "express";
import authenticate from "../config/auth.js";
import {
    GetUser,
    CreateUser,
    GetLogsByUserId,
    CreateLog,
    UpdateLog,
    DeleteLog,
    GetPlansByUserId,
    CreatePlan,
    UpdatePlan,
    DeletePlan
} from "../controller/dbController.js";

const router = express.Router();

// (Optional) allow public user creation
router.post("/users", CreateUser);

// All following routes require a valid JWT
router.use(authenticate);

router.get("/users/:id", GetUser);

router.get("/users/:userId/logs", GetLogsByUserId);
router.post("/users/:userId/logs", CreateLog);

router.delete("/logs/:id", DeleteLog);

router.get("/users/:userId/plans", GetPlansByUserId);
router.post("/users/:userId/plans", CreatePlan);

router.delete("/plans/:id", DeletePlan);

router.put("/users/:userId/logs/:id", UpdateLog);
router.put("/users/:userId/plans/:id", UpdatePlan);


export default router;
