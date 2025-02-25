import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: { id: number; role?: string };
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    password: string;
}

