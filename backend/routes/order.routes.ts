import { Router, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { getOrder, placeOrder } from "../controllers/order.controller";

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

const router = Router();

// Place Order
router.post("/", authenticateToken, 
 placeOrder
);

// Get Orders of Logged-in User
router.get("/", authenticateToken, 
   getOrder
);

export default router;
