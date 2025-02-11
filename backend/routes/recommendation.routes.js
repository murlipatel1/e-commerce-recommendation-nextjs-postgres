const { Router } = require("express");
const sequelize = require("../config/db.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = Router();

// Get Recommended Products for a User
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await sequelize.query(
            "SELECT * FROM recommendations WHERE user_id = $1",
            {
                bind: [req.user.id],
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recommendations", error: error.message });
    }
});

module.exports = router;
