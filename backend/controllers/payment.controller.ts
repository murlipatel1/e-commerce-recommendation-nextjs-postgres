import { NextFunction, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import { AuthenticatedRequest } from "../utils/type";

export const processPayment = async (req: AuthenticatedRequest, res: Response,next:NextFunction): Promise<void> => {
    const { 
        order_id, 
        payment_method, 
        transaction_id, 
        shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
        billing_name, billing_address, billing_city, billing_state, billing_zip, billing_country
    } = req.body;

    if (!order_id || !payment_method || !shipping_name || !billing_name) {
        res.status(400).json({ message: "Order ID, payment method, and addresses are required" });
        return;
    }

    try {
        // Generate transaction ID if not provided
        const txnId = transaction_id ?? `txn_${Date.now()}`;

        await sequelize.query(
            `INSERT INTO payments (order_id, user_id, payment_method, transaction_id, status, 
                                  shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, 
                                  billing_name, billing_address, billing_city, billing_state, billing_zip, billing_country) 
             VALUES ($1, $2, $3, $4, 'completed', 
                     $5, $6, $7, $8, $9, $10, 
                     $11, $12, $13, $14, $15, $16) RETURNING *`,
            {
                bind: [
                    order_id, req.user?.id, payment_method, txnId, 
                    shipping_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, 
                    billing_name, billing_address, billing_city, billing_state, billing_zip, billing_country
                ],
                type: QueryTypes.INSERT,
            }
        );

        // Update order status to "shipped"
        await sequelize.query(`UPDATE orders SET status = 'shipped' WHERE id = $1`, {
            bind: [order_id],
            type: QueryTypes.UPDATE,
        });

        res.status(200).json({ message: "Payment successful", transaction_id: txnId });
    } catch (error) {
        next(error);
    }
};


// View payment history
export const getPayments = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
    try {
        const payments = await sequelize.query(
            `SELECT * FROM payments WHERE user_id = $1`,
            { bind: [req.user?.id], type: QueryTypes.SELECT }
        );

        res.json(payments);
    } catch (error) {
        next(error);
    }
};

// Confirm payment

// Confirm payment after successful transaction
export const confirmPayment = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
    const { order_id, transaction_id } = req.query;

    try {
        // Update payment status to "completed"
        await sequelize.query(
            `UPDATE payments SET status = 'completed' WHERE order_id = $1 AND transaction_id = $2`,
            { bind: [order_id, transaction_id], type: QueryTypes.UPDATE }
        );

        // Update order status to "shipped"
        await sequelize.query(`UPDATE orders SET status = 'shipped' WHERE id = $1`, {
            bind: [order_id],
            type: QueryTypes.UPDATE,
        });

        res.status(200).json({ message: "Payment confirmed successfully" });

    } catch (error) {
        next(error);
    }
};
