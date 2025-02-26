import { Router, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import authenticateToken from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../utils/type";
import { uploadPhoto, uploadToImageKit } from "../middleware/upload.middleware";
import { creatProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller";

const router = Router();

// Create Product (Admin only)
router.post("/", uploadPhoto, uploadToImageKit, authenticateToken, 
    creatProduct
);

// Get All Products
router.get("/", getAllProducts);

// Get Product by ID
router.get("/:id",
     getProductById
);

// Delete Product (Admin only)
router.delete("/:id", authenticateToken, 
   deleteProduct
);

// Update Product (Admin only)
router.put("/:id", uploadPhoto, uploadToImageKit, authenticateToken, 
    updateProduct
);

export default router;