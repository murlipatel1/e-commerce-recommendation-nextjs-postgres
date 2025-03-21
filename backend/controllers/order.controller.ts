import {NextFunction, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import { AuthenticatedRequest } from "../utils/type";

// Place Order
export const placeOrder =async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
    const { user_id, total_price } = req.body;

    try {
        const result = await sequelize.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'pending') RETURNING *",
            {
                bind: [user_id, total_price],
                type: QueryTypes.SELECT
            }
        );
     
        res.status(201).json(result[0]);
    } catch (error) {
        next(error);
    }
};

// Get Orders of Logged-in User
export const getOrder = async (req: AuthenticatedRequest, res: Response,next:NextFunction) => {
    try {
        const result = await sequelize.query("SELECT * FROM orders WHERE user_id = $1", {
            bind: [req.user?.id],
            type: QueryTypes.SELECT
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};
