import { Router } from "express";
import { registerUser, loginUser, refershToken, logoutUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refershToken);
router.post("/logout", logoutUser);

export default router;
