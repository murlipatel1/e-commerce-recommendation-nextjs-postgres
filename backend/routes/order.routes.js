const { Router } = require("express");
const sequelize = require("../config/db.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = Router();

// Place Order
router.post("/", authenticateToken, async (req, res) => {
    const { user_id, total_price } = req.body;

    try {
        const result = await sequelize.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'pending') RETURNING *",
            {
                bind: [user_id, total_price],
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

// Get Orders of Logged-in User
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await sequelize.query("SELECT * FROM orders WHERE user_id = $1", {
            bind: [req.user.id],
            type: sequelize.QueryTypes.SELECT
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

module.exports = router;
