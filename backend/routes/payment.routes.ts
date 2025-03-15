import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware";
import { processPayment, confirmPayment, getPayments } from "../controllers/payment.controller";
import errorHandler from "../middleware/errorHandler.middleware";

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               user_id:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payment:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *       401:
 *         description: Unauthorized
 */
const router = Router();

router.post("/", authenticateToken, processPayment, errorHandler);
router.get("/confirm", authenticateToken, confirmPayment, errorHandler);
router.get("/history", authenticateToken, getPayments, errorHandler);

export default router;
