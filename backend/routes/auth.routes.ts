import { Router } from "express";
import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const router = Router();


// Function to generate JWT token
const generateAccessToken = (user: any) => {
    return sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};

const generateRefreshToken = (user: any) => {
    return sign({ id: user.id }, process.env.REFRESH_SECRET as string, { expiresIn: "7d" });
};

// Register User
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await hash(password, 10);
        const result = await sequelize.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            {
                bind: [name, email, hashedPassword, role || 'user'],
                type: QueryTypes.INSERT
            }
        );

        res.status(201).json({ message: "User registered", user: result[0] });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: (error as Error).message });
    }
});

// Login User
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await sequelize.query("SELECT * FROM users WHERE email = $1", {
            bind: [email],
            type: QueryTypes.SELECT
        });

        if (result?.length === 0) res.status(401).json({ message: "Invalid credentials" });

        const user = result[0] as { id: number, name: string, email: string, password: string, role: string };
        const isMatch = await compare(password, user.password);

        if (!isMatch)  res.status(401).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await sequelize.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')", {
            bind: [user.id, refreshToken],
            type: QueryTypes.INSERT
        });

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: (error as Error).message });
    }
});

// Refresh Token
router.post("/refresh", async (req: Request, res: Response): Promise<any> => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(403).json({ message: "Refresh token required" });

    try {
        const result = await sequelize.query("SELECT * FROM refresh_tokens WHERE token = $1", {
            bind: [refreshToken],
            type: QueryTypes.SELECT
        });
        if (result?.length === 0) return res.status(403).json({ message: "Invalid refresh token" });

        const refreshSecret = process.env.REFRESH_SECRET;
        if (!refreshSecret) {
            return res.status(500).json({ message: "Refresh secret not defined" });
        }
        verify(refreshToken, refreshSecret, (err:any, user:any) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: "Error refreshing token", error: (error as Error).message });
    }
});


// Logout User
router.post("/logout", async (req:Request, res:Response) => {
    const refreshToken = req.cookies.refreshToken;
   
    await sequelize.query("DELETE FROM refresh_tokens WHERE token = $1", {
        bind: [refreshToken],
        type: QueryTypes.DELETE
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
});

export default router;
