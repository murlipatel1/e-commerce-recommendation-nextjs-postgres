import { Router } from "express";
import pool from "../config/db";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Create Product (Admin only)
router.post("/", authenticateToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const { name, description, price, stock, category } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, price, stock, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
});

// Get All Products
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

// Get Product by ID
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Product not found" });

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
});

// Delete Product (Admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    try {
        await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

export default router;
