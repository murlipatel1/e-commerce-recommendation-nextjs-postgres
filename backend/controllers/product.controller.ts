import {NextFunction, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import { AuthenticatedRequest } from "../utils/type";

// Create Product (Admin only)
export const creatProduct = async (req: AuthenticatedRequest, res: Response,next:NextFunction): Promise<void> => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }

    const { name, description, price, stock, category } = req.body;
    const photo_url = req.body.photo_url || "";

    try {
        const result = await sequelize.query(
            "INSERT INTO products (name, description, price, stock, category, photo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            {
                bind: [name, description, price, stock, category, photo_url],
                type: QueryTypes.INSERT
            }
        );
        res.status(201).json(result[0]);
    } catch (error) {
        next(error);
    }
};

// Get All Products
export const getAllProducts = async (req:AuthenticatedRequest, res:Response,next:NextFunction) => {
    try {
        const result = await sequelize.query("SELECT * FROM products", {
            type: QueryTypes.SELECT
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: (error as Error).message });
    }
};

// Get Product by ID
export const getProductById= async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
};

// Delete Product (Admin only)
export const deleteProduct= async (req: AuthenticatedRequest, res: Response,next:NextFunction): Promise<void> => {
    if (req.user?.role !== "admin") res.status(403).json({ message: "Unauthorized" });

    try {
        await sequelize.query("DELETE FROM products WHERE id = $1", {
            bind: [req.params.id],
            type: QueryTypes.DELETE
        });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Update Product (Admin only)
export const updateProduct = async (req: AuthenticatedRequest, res: Response,next:NextFunction): Promise<void> => {
    if (req.user?.role !== "admin") res.status(403).json({ message: "Unauthorized" });

    const { name, description, price, stock, category, photo_url } = req.body;

    try {
        await sequelize.query(
            "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, photo_url = $6 WHERE id = $7",
            {
                bind: [name, description, price, stock, category, photo_url, req.params.id],
                type: QueryTypes.UPDATE
            }
        );
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        next(error);
    }
};
