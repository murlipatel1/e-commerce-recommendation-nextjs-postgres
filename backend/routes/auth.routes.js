import { Router } from "express";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import pool from "../config/db";
const router = Router();

const generateAccessToken = (user) => {
    return sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
    return sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await hash(password, 10);
        const result = await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role", 
            [name, email, hashedPassword, role || 'user']);

        res.status(201).json({ message: "User registered", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = result.rows[0];
        const isMatch = await compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await pool.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')", 
            [user.id, refreshToken]);

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

// Refresh Token
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(403).json({ message: "Refresh token required" });

    try {
        const result = await pool.query("SELECT * FROM refresh_tokens WHERE token = $1", [refreshToken]);
        if (result.rows.length === 0) return res.status(403).json({ message: "Invalid refresh token" });

        verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token", error: error.message });
    }
});

// Logout User
router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken]);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
});

export default router;
