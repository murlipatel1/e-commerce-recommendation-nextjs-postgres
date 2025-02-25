import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware";
import { placeOrder, getUserOrders } from "../controllers/order.controller";

const router = Router();

router.post("/", authenticateToken, placeOrder);
router.get("/", authenticateToken, getUserOrders);

export default router;
