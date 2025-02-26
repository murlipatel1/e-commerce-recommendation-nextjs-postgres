import { Router } from "express";
import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import dotenv from "dotenv";
import { User } from "../utils/type";
import { loginFn, logoutFn, refreshFn, registerFn } from "../controllers/auth.controller";

dotenv.config();

const router = Router();


// Function to generate JWT token
const generateAccessToken = (user: User) => {
    return sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};

const generateRefreshToken = (user: User) => {
    return sign({ id: user.id }, process.env.REFRESH_SECRET as string, { expiresIn: "7d" });
};

// Register User
router.post("/register",
    registerFn
);

// Login User
router.post("/login",
    loginFn
);

// Refresh Token
router.post("/refresh",
    refreshFn
);


// Logout User
router.post("/logout",
    logoutFn);

export default router;
