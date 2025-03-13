import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authenticateToken from "../../middleware/auth.middleware";
import { AuthenticatedRequest } from "../../utils/type";

jest.mock("jsonwebtoken");

describe("authenticateToken Middleware", () => {
    let req: Partial<AuthenticatedRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            cookies: {},
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should return 401 if token is missing", () => {
        authenticateToken(req as AuthenticatedRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Access denied, token missing" });
    });

    it("should return 403 if token is invalid", () => {
        req.cookies = { accessToken: "invalidtoken" };
        (verify as jest.Mock).mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null);
        });

        authenticateToken(req as AuthenticatedRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    });

    it("should call next if token is valid", () => {
        req.cookies = { accessToken: "validtoken" };
        const decodedToken = { id: 1, email: "test@example.com", role: "user" };
        (verify as jest.Mock).mockImplementation((token, secret, callback) => {
            callback(null, decodedToken);
        });

        authenticateToken(req as AuthenticatedRequest, res as Response, next);

        expect(req.user).toEqual(decodedToken);
        expect(next).toHaveBeenCalled();
    });
});
