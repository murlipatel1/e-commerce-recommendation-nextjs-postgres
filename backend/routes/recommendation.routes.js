import { Router } from "express";
import pool from "../config/db";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Get Recommended Products for a User
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM recommendations WHERE user_id = $1",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recommendations", error: error.message });
    }
});

export default router;
