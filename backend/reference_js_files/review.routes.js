const { Router } = require("express");
const sequelize = require("../config/db.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = Router();

// Add Review
router.post("/", authenticateToken, async (req, res) => {
    const { product_id, rating, comment } = req.body;

    try {
        const result = await sequelize.query(
            "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
            {
                bind: [req.user.id, product_id, rating, comment],
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
});

module.exports = router;
