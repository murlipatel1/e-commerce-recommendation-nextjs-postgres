const express = require("express");
const pool = require("../config/db");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

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

module.exports = router;
