import { Request, Response, NextFunction } from "express";
import client from "../config/cache";

export const cache = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;

    try {
        const cachedData = await client.get(key);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        next();
    } catch (error) {
        console.error("Cache error", error);
        next();
    }
};

export const setCache = async (key: string, data: any, ttl: number = 3600) => {
    try {
        await client.setEx(key, ttl, JSON.stringify(data));
    } catch (error) {
        console.error("Set cache error", error);
    }
};
