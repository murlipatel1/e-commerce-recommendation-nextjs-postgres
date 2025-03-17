import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware";
import {forgotPassword,resetPassword } from "../controllers/otp.controller";
// import errorHandler from "../middleware/errorHandler.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/otp/forgot-password:
 *   post:
 *     summary: Send OTP to user's email for password reset
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       404:
 *         description: User not found
 *       500:
 *         description: Error sending OTP
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/v1/otp/reset-password:
 *   post:
 *     summary: Reset user's password
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Error resetting password
 */
router.post("/reset-password",authenticateToken,resetPassword);

export default router;

