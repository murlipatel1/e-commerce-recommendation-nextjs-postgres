import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware";
import { getRecommendations, updateRecommendations } from "../controllers/recommendation.controller";

const router = Router();

router.get("/", authenticateToken, getRecommendations);
router.post("/update", authenticateToken, updateRecommendations);

export default router;
