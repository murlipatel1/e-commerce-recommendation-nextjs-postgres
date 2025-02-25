import { Router, Response, NextFunction } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/type";
import { addReview } from "../controllers/review.controller";
import { getProductById } from "../controllers/product.controller";

const router = Router();

// get reviews for each product
router.get("/:product_id", getProductById); 

// Add Review
router.post("/", authenticateToken, addReview);

export default router;
