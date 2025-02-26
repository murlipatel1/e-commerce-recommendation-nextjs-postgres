import { Router, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/type";
import { getRecommendationById, updateRecommendationById } from "../controllers/recommendation.controller";

const router = Router();

// Get Recommended Products for a User
router.get("/", authenticateToken, 
    getRecommendationById
);

// Add/Update Recommendations based on category visits
router.post("/update", authenticateToken, 
    updateRecommendationById
);

export default router;
