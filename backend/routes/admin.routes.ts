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

/**
 * @swagger
 * /api/v1/admin/sales:
 *   get:
 *     summary: Get sales data
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales data retrieved successfully
 *       500:
 *         description: Error retrieving sales data
 */
router.get("/sales", authenticateToken, getSalesData);

/**
 * @swagger
 * /api/v1/admin/registrations:
 *   get:
 *     summary: Get user registrations data
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User registrations data retrieved successfully
 *       500:
 *         description: Error retrieving user registrations data
 */
router.get("/registrations", authenticateToken, getUserRegistrations);

/**
 * @swagger
 * /api/v1/admin/product-performance:
 *   get:
 *     summary: Get product performance data
 *     tags: [Admin Dashboard] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product performance data retrieved successfully
 *       500:
 *         description: Error retrieving product performance data
 */
router.get("/product-performance", authenticateToken, getProductPerformance);

/**
 * @swagger
 * /api/v1/admin/order-stats:
 *   get:
 *     summary: Get order statistics
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics retrieved successfully
 *       500:
 *         description: Error retrieving order statistics
 */
router.get("/order-stats", authenticateToken, getOrderStats);

/**
 * @swagger
 * /api/v1/admin/recommendations:
 *   get:
 *     summary: Get recommendations data
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommendations data retrieved successfully
 *       500:
 *         description: Error retrieving recommendations data
 */
router.get("/recommendations", authenticateToken, getRecommendationsData);

export default router;
