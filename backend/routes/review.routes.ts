import { Router} from "express";
import authenticateToken from "../middleware/auth.middleware";
import { addReview, getReviewById } from "../controllers/review.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/reviews/{product_id}:
 *   get:
 *     summary: Get reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *       404:
 *         description: Product not found
 */
router.get("/:product_id",
     getReviewById
);

/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: Add a review for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: number
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateToken, 
  addReview
);

export default router;