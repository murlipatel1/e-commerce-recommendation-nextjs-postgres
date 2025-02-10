import { Router } from "express";
import pool from "../config/db";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Add Review
router.post("/", authenticateToken, async (req, res) => {
    const { product_id, rating, comment } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, product_id, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
});

export default router;
