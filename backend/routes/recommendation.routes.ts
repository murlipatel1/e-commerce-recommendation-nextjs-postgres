import { Router, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/type";

const router = Router();

// Get Recommended Products for a User
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = await sequelize.query(
            "SELECT * FROM recommendations WHERE user_id = $1",
            {
                bind: [req.user?.id],
                type: QueryTypes.SELECT
            }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recommendations", error: (error as Error).message });
    }
});

// Add/Update Recommendations based on category visits
router.post("/update", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { category, product_id } = req.body;

    try {
        // Check if the user already has a recommendation for this category
        const existingRecommendation = await sequelize.query(
            "SELECT * FROM recommendations WHERE user_id = $1 AND category = $2 AND product_id = $3",
            {
                bind: [req.user?.id, category, product_id],
                type: QueryTypes.SELECT
            }
        );

        if (existingRecommendation.length > 0) {
            // Update the existing recommendation
            await sequelize.query(
                "UPDATE recommendations SET visit_count = visit_count + 1 WHERE user_id = $1 AND category = $2 AND product_id = $3",
                {
                    bind: [req.user?.id, category, product_id],
                    type: QueryTypes.UPDATE
                }
            );
        } else {
            // Add a new recommendation
            await sequelize.query(
                "INSERT INTO recommendations (user_id, category, product_id, visit_count) VALUES ($1, $2, $3, 1)",
                {
                    bind: [req.user?.id, category, product_id],
                    type: QueryTypes.INSERT
                }
            );
        }

        res.json({ message: "Recommendation updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating recommendation", error: (error as Error).message });
    }
});

export default router;
