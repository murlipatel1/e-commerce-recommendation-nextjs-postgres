import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import { AuthenticatedRequest } from "../utils/type";

// Add item to cart
export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
    const { product_id, quantity } = req.body;

    try {
        await sequelize.query(
            `INSERT INTO cart (user_id, product_id, quantity) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, product_id) 
            DO UPDATE SET quantity = cart.quantity + $3 RETURNING *`,
            {
                bind: [req.user?.id, product_id, quantity],
                type: QueryTypes.INSERT,
            }
        );

        res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: (error as Error).message });
    }
};

// View cart items
export const getCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const cartItems = await sequelize.query(
            `SELECT cart.id, cart.quantity, products.name, products.price 
            FROM cart 
            JOIN products ON cart.product_id = products.id 
            WHERE cart.user_id = $1`,
            { bind: [req.user?.id], type: QueryTypes.SELECT }
        );

        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: (error as Error).message });
    }
};

// Remove item from cart
export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
    const { product_id } = req.body;

    try {
        await sequelize.query(`DELETE FROM cart WHERE user_id = $1 AND product_id = $2`, {
            bind: [req.user?.id, product_id],
            type: QueryTypes.DELETE,
        });

        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error: (error as Error).message });
    }
};
