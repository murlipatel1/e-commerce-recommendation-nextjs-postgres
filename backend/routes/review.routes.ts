import { Router, Response, NextFunction } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/type";

const router = Router();

// get reviews for each product
router.get("/:product_id", async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { product_id } = req.params;
    
    try {
        const result = await sequelize.query(
            "SELECT reviews.id, reviews.rating, reviews.comment, users.name as user_name, reviews.created_at FROM reviews JOIN users ON reviews.user_id = users.id WHERE product_id = $1",
            {
                bind: [product_id],
                type: QueryTypes.SELECT,
            }
        );

        res.status(200).json(result);
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
}); 

// Add Review
router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { product_id, rating, comment } = req.body;

    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const result = await sequelize.query(
            "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
            {
                bind: [req.user.id, product_id, rating, comment],
                type: QueryTypes.INSERT,
            }
        );

        res.status(201).json(result[0]);
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
});

export default router;
