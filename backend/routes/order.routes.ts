import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware";
import { getOrder, placeOrder } from "../controllers/order.controller";
import errorHandler from "../middleware/errorHandler.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               total_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       500:
 *         description: Error placing order
 */
router.post("/", authenticateToken, placeOrder,errorHandler);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get orders of the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Error fetching orders
 */
router.get("/", authenticateToken, getOrder,errorHandler);

export default router;
