import { Router, Response, NextFunction } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/type";
import { addReview } from "../controllers/review.controller";

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
router.post("/", authenticateToken, addReview);

export default router;
