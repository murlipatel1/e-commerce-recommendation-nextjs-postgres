import { Request } from "express";


export interface AuthenticatedRequest extends Request {
    user?: { id: number; email: string; role: string };
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    password: string;
}

