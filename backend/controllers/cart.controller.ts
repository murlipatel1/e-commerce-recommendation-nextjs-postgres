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
            `SELECT cart.id, cart.quantity, 
                    products.name, products.price, 
                    products.photo_url, 
                    (cart.quantity * products.price) AS total_price
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
export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { product_id } = req.query;

    try {
        // Fetch the product's quantity from the cart using `product_id`
        const existing: any[] = await sequelize.query(
            `SELECT quantity FROM cart WHERE user_id = $1 AND id = $2`,
            { bind: [req.user?.id, product_id], type: QueryTypes.SELECT }
        );

        if (!existing || existing.length === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const currentQuantity = existing[0].quantity; // ✅ Extract correct quantity

        if (currentQuantity > 1) {
            // If quantity > 1, decrease by 1
            await sequelize.query(
                `UPDATE cart SET quantity = quantity - 1 WHERE user_id = $1 AND id = $2`,
                { bind: [req.user?.id, product_id], type: QueryTypes.UPDATE }
            );

            return res.json({ message: "Quantity decreased by 1" });
        } else {
            // If quantity == 1, delete the product from the cart
            await sequelize.query(
                `DELETE FROM cart WHERE user_id = $1 AND id = $2`,
                { bind: [req.user?.id, product_id], type: QueryTypes.DELETE }
            );

            return res.json({ message: "Item removed from cart" });
        }
    } catch (error) {
        console.error("Error removing item:", error);
        res.status(500).json({ message: "Error removing item", error: (error as Error).message });
    }
};



// Clear cart for a user
export const clearCart = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const [existing] = await sequelize.query(
            `SELECT id FROM cart WHERE user_id = $1`,
            { bind: [req.user?.id], type: QueryTypes.SELECT }
        );

        if (!existing) {
            return res.json({ message: "Cart is already empty" });
        }

        await sequelize.query(`DELETE FROM cart WHERE user_id = $1`, {
            bind: [req.user?.id],
            type: QueryTypes.DELETE,
        });

        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: (error as Error).message });
    }
};
