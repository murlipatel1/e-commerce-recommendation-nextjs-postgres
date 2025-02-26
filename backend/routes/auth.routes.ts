import { Router } from "express";
import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import dotenv from "dotenv";
import { User } from "../utils/type";
import { loginFn, logoutFn, refreshFn, registerFn } from "../controllers/auth.controller";
import { uploadPhoto, uploadToImageKit } from "../middleware/upload.middleware";

dotenv.config();

const router = Router();

// Function to generate JWT token
const generateAccessToken = (user: User) => {
    return sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};

const generateRefreshToken = (user: User) => {
    return sign({ id: user.id }, process.env.REFRESH_SECRET as string, { expiresIn: "7d" });
};

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Error registering user
 */
router.post("/register", uploadPhoto, uploadToImageKit, registerFn);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in
 */
router.post("/login", loginFn);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Error refreshing token
 */
router.post("/refresh", refreshFn);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Error logging out
 */
router.post("/logout", logoutFn);

export default router;
