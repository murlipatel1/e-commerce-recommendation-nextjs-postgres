import { Router, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

const router = Router();

// Place Order
export const placeOrder =async (req: AuthenticatedRequest, res: Response) => {
    const { user_id, total_price } = req.body;

    try {
        const result = await sequelize.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'pending') RETURNING *",
            {
                bind: [user_id, total_price],
                type: QueryTypes.INSERT
            }
        );
        res.status(201).json(result[0]);
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: (error as Error).message });
    }
};

// Get Orders of Logged-in User
export const getOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = await sequelize.query("SELECT * FROM orders WHERE user_id = $1", {
            bind: [req.user?.id],
            type: QueryTypes.SELECT
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: (error as Error).message });
    }
};

export default router;
