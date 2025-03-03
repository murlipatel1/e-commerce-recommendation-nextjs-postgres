import { Router} from "express";
import authenticateToken from "../middleware/auth.middleware";
import { getRecommendationById, updateRecommendationById } from "../controllers/recommendation.controller";
import errorHandler from "../middleware/errorHandler.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/recommendations:
 *   get:
 *     summary: Get recommended products for the logged-in user
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recommended products
 *       500:
 *         description: Error fetching recommendations
 */
router.get("/", authenticateToken, getRecommendationById);

/**
 * @swagger
 * /api/v1/recommendations/update:
 *   post:
 *     summary: Update recommendations based on category visits
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               product_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Recommendation updated successfully
 *       500:
 *         description: Error updating recommendation
 */
router.post("/update", authenticateToken, updateRecommendationById,errorHandler);

export default router;
