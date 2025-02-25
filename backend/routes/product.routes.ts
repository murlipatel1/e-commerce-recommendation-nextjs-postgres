import { Router } from "express";
import authenticateToken from "../middleware/auth.middleware";
import { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } from "../controllers/product.controller";

const router = Router();

router.post("/", authenticateToken, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", authenticateToken, deleteProduct);
router.put("/:id", authenticateToken, updateProduct);

export default router;
