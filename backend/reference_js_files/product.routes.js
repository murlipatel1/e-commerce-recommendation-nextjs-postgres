const { Router } = require("express");
const sequelize = require("../config/db.js");
const authenticateToken = require("../middleware/auth.middleware.js");

const router = Router();

// Create Product (Admin only)
router.post("/", authenticateToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const { name, description, price, stock, category } = req.body;

    try {
        const result = await sequelize.query(
            "INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            {
                bind: [name, description, price, stock, category],
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
});

// Get All Products
router.get("/", async (req, res) => {
    try {
        const result = await sequelize.query("SELECT * FROM products", {
            type: sequelize.QueryTypes.SELECT
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

// Get Product by ID
router.get("/:id", async (req, res) => {
    try {
        const result = await sequelize.query("SELECT * FROM products WHERE id = $1", {
            bind: [req.params.id],
            type: sequelize.QueryTypes.SELECT
        });
        if (result.length === 0) return res.status(404).json({ message: "Product not found" });

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
});

// Delete Product (Admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    try {
        await sequelize.query("DELETE FROM products WHERE id = $1", {
            bind: [req.params.id],
            type: sequelize.QueryTypes.DELETE
        });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

module.exports = router;
