import { Request, Response, NextFunction } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";

// Get Sales Data
export const getSalesData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await sequelize.query(
      "SELECT DATE(created_at) as date, SUM(total_price) as total FROM orders GROUP BY DATE(created_at) ORDER BY DATE(created_at)",
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get User Registrations
export const getUserRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await sequelize.query(
      "SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY DATE(created_at)",
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get Product Performance
export const getProductPerformance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await sequelize.query(
      `SELECT p.name AS productName, COUNT(r.id) AS total_reviews, AVG(r.rating) AS average_rating 
      FROM products p 
      LEFT JOIN reviews r ON p.id = r.product_id 
      GROUP BY p.id, p.name 
      ORDER BY total_reviews DESC`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get Order Statistics
export const getOrderStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await sequelize.query(
      `SELECT status, COUNT(*) AS count 
      FROM orders 
      GROUP BY status`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get Recommendations Data
export const getRecommendationsData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await sequelize.query(
      `SELECT category, COUNT(*) AS total_recommendations 
      FROM recommendations 
      GROUP BY category 
      ORDER BY total_recommendations DESC`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
