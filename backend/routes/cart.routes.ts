import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware";
import { addToCart, clearCart, getCart, removeFromCart } from "../controllers/cart.controller";
import errorHandler from "../middleware/errorHandler.middleware";

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all items in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: Product ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
const router = Router();

router.post("/", authenticateToken, addToCart, errorHandler);
router.get("/", authenticateToken, getCart, errorHandler);
router.delete("/", authenticateToken, removeFromCart, errorHandler);
router.delete("/clear", authenticateToken, clearCart);
export default router;
