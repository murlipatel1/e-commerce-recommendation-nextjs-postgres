import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import { AuthenticatedRequest } from "../utils/type";

// Process payment
export const processPayment = async (req: AuthenticatedRequest, res: Response) => {
    const { order_id, payment_method, transaction_id } = req.body;

    try {
        await sequelize.query(
            `INSERT INTO payments (order_id, user_id, payment_method, transaction_id, status) 
            VALUES ($1, $2, $3, $4, 'completed') RETURNING *`,
            {
                bind: [order_id, req.user?.id, payment_method, transaction_id],
                type: QueryTypes.INSERT,
            }
        );

        // Update order status to "completed"
        await sequelize.query(`UPDATE orders SET status = 'shipped' WHERE id = $1`, {
            bind: [order_id],
            type: QueryTypes.UPDATE,
        });

        res.status(200).json({ message: "Payment successful" });
    } catch (error) {
        res.status(500).json({ message: "Error processing payment", error: (error as Error).message });
    }
};

// View payment history
export const getPayments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const payments = await sequelize.query(
            `SELECT * FROM payments WHERE user_id = $1`,
            { bind: [req.user?.id], type: QueryTypes.SELECT }
        );

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error: (error as Error).message });
    }
};
