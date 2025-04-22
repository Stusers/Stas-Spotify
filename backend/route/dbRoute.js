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

router.post("/users", CreateUser);

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
