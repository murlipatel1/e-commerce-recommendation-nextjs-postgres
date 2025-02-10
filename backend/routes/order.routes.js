const express = require("express");
const pool = require("../config/db");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Place Order
router.post("/", authenticateToken, async (req, res) => {
    const { user_id, total_price } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'pending') RETURNING *",
            [user_id, total_price]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

// Get Orders of Logged-in User
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

module.exports = router;
