import { Router } from "express";
import {
    createProgress,
    deleteProgress,
    getProgressById,
    getProgressByUserId,
    updateProgress,
} from "../controllers/progressController.ts";

const progressRoutes = Router();

progressRoutes.post("/", createProgress);
progressRoutes.get("/:id", getProgressById);
progressRoutes.get("/user/:userId", getProgressByUserId);
progressRoutes.patch("/:id", updateProgress);
progressRoutes.delete("/:id", deleteProgress);

export default progressRoutes;
