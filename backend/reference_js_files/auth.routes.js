const { Router } = require("express");
const { hash, compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const sequelize = require("../config/db.js");

const router = Router();

const generateAccessToken = (user) => {
    return sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (user) => {
    return sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await hash(password, 10);
        const result = await sequelize.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            {
                bind: [name, email, hashedPassword, role || 'user'],
                type: sequelize.QueryTypes.INSERT
            }
        );

        res.status(201).json({ message: "User registered", user: result[0] });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await sequelize.query("SELECT * FROM users WHERE email = $1", {
            bind: [email],
            type: sequelize.QueryTypes.SELECT
        });

        if (result.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = result[0];
        const isMatch = await compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await sequelize.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')", {
            bind: [user.id, refreshToken],
            type: sequelize.QueryTypes.INSERT
        });

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
        const result = await sequelize.query("SELECT * FROM refresh_tokens WHERE token = $1", {
            bind: [refreshToken],
            type: sequelize.QueryTypes.SELECT
        });
        if (result.length === 0) return res.status(403).json({ message: "Invalid refresh token" });

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
    await sequelize.query("DELETE FROM refresh_tokens WHERE token = $1", {
        bind: [refreshToken],
        type: sequelize.QueryTypes.DELETE
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;
