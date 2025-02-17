import { Router, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/type";


const router = Router();

// Create Product (Admin only)
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }

    const { name, description, price, stock, category } = req.body;

    try {
        const result = await sequelize.query(
            "INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            {
                bind: [name, description, price, stock, category],
                type: QueryTypes.INSERT
            }
        );
        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: (error as Error).message });
    }
});

// Get All Products
router.get("/", async (req, res) => {
    try {
        const result = await sequelize.query("SELECT * FROM products", {
            type: QueryTypes.SELECT
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: (error as Error).message });
    }
});

// Get Product by ID
router.get("/:id", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const result: any[] = await sequelize.query("SELECT * FROM products WHERE id = $1", {
            bind: [req.params.id],
            type: QueryTypes.SELECT
        });
        if (result?.length === 0) res.status(404).json({ message: "Product not found" });

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: (error as Error).message });
    }
});

// Delete Product (Admin only)
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.user?.role !== "admin") res.status(403).json({ message: "Unauthorized" });

    try {
        await sequelize.query("DELETE FROM products WHERE id = $1", {
            bind: [req.params.id],
            type: QueryTypes.DELETE
        });
        res.json({ message: "Product deleted successfully" });
    } catch (error ) {
        res.status(500).json({ message: "Error deleting product", error: (error as Error).message });
    }
});

// Update Product (Admin only)
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.user?.role !== "admin") res.status(403).json({ message: "Unauthorized" });

    const { name, description, price, stock, category } = req.body;

    try {
        await sequelize.query(
            "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5 WHERE id = $6",
            {
                bind: [name, description, price, stock, category, req.params.id],
                type: QueryTypes.UPDATE
            }
        );
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: (error as Error).message });
    }
});

export default router;
