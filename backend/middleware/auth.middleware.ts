import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AuthenticatedRequest } from "../utils/type";

export default function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access denied, token missing" });
        return; 
    }

    verify(token, process.env.JWT_SECRET as string, (err: Error | null, decoded: any) => {
   
        if (err) {
            res.status(403).json({ message: "Invalid token" });
            return;
        }
    
        req.user = decoded as { id: number; email: string; role: string };
        next();
    });
}
