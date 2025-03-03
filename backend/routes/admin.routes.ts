import { Router } from "express";
import { 
  getSalesData, 
  getUserRegistrations, 
  getProductPerformance, 
  getOrderStats, 
  getRecommendationsData 
} from "../controllers/admin.controller";
import authenticateToken from "../middleware/auth.middleware";

const router = Router();

router.get("/sales", authenticateToken, getSalesData);
router.get("/registrations", authenticateToken, getUserRegistrations);
router.get("/product-performance", authenticateToken, getProductPerformance);
router.get("/order-stats", authenticateToken, getOrderStats);
router.get("/recommendations", authenticateToken, getRecommendationsData);

export default router;
