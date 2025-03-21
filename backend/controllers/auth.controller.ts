import { Request, Response, NextFunction } from "express";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { QueryTypes } from "sequelize";
import sequelize from "../config/db";
import dotenv from "dotenv";
import { AuthenticatedRequest, User } from "../utils/type";

dotenv.config();

// Function to generate JWT token
const generateAccessToken = (user: User) => {
    return sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};

const generateRefreshToken = (user: User) => {
    return sign({ id: user.id }, process.env.REFRESH_SECRET as string, { expiresIn: "7d" });
};

// Register User
export const registerFn =
    async (req: Request, res: Response,next:NextFunction) => {
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
            next(error);
        }
    };

// Login User
export const loginFn = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await sequelize.query("SELECT * FROM users WHERE email = $1", {
            bind: [email],
            type: QueryTypes.SELECT
        });

        if (result?.length === 0) res.status(401).json({ message: "Invalid credentials" });

        const user = result[0] as { id: number, name: string, email: string, password: string, role: string };
        const isMatch = await compare(password, user.password);

        if (!isMatch) res.status(401).json({ message: "Invalid credentials" });

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
        next(error);
    }
};

// Refresh Token
export const refreshFn =  async (req: Request, res: Response,next:NextFunction): Promise<any> => {
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
        verify(refreshToken, refreshSecret, (err: Error | null, user: any) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        next(error);
    }
};


// Logout User
export const logoutFn= async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    await sequelize.query("DELETE FROM refresh_tokens WHERE token = $1", {
        bind: [refreshToken],
        type: QueryTypes.DELETE
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};

// Get User by ID
export const getUserById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await sequelize.query("SELECT id, name, email, role, photo_url FROM users WHERE id = $1", {
            bind: [id],
            type: QueryTypes.SELECT
        });

        if (result.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(result[0]);
    } catch (error) {
        next(error); // Pass error to error-handling middleware
    }
};

