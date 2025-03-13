import { Request, Response, NextFunction } from "express";
import client from "../../config/cache";
import { cache, setCache } from "../../middleware/cache.middleware";

jest.mock("../../config/cache");

describe("Cache Middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            originalUrl: "/test",
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should return cached data if available", async () => {
        const cachedData = JSON.stringify({ message: "cached data" });
        (client.get as jest.Mock).mockResolvedValue(cachedData);

        await cache(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(JSON.parse(cachedData));
    });

    it("should call next if no cached data is available", async () => {
        (client.get as jest.Mock).mockResolvedValue(null);

        await cache(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it("should call next if there is an error retrieving cached data", async () => {
        (client.get as jest.Mock).mockRejectedValue(new Error("Cache error"));

        await cache(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it("should set cache data", async () => {
        const key = "/test";
        const data = { message: "test data" };
        const ttl = 3600;

        await setCache(key, data, ttl);

        expect(client.setEx).toHaveBeenCalledWith(key, ttl, JSON.stringify(data));
    });

    it("should log an error if there is an error setting cache data", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation();
        (client.setEx as jest.Mock).mockRejectedValue(new Error("Set cache error"));

        const key = "/test";
        const data = { message: "test data" };
        const ttl = 3600;

        await setCache(key, data, ttl);

        expect(consoleSpy).toHaveBeenCalledWith("Set cache error", expect.any(Error));
        consoleSpy.mockRestore();
    });
});
