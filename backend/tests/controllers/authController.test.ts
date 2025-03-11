import request from "supertest";
import app from "../../index";
import sequelize from "../../config/db";
import { sign } from "jsonwebtoken";

const mockUser = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    password: "hashedpassword",
    role: "user",
};

jest.mock("../../config/db", () => {
    return {
        query: jest.fn(),
    };
});

const mockToken = sign({ id: mockUser.id, email: mockUser.email, role: mockUser.role }, "jwt-secret", { expiresIn: "1d" });

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Auth Controller", () => {
    describe("POST /register", () => {
        it("should register a user", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([[mockUser]]);

            const response = await request(app).post("/api/v1/auth/register").send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password123",
                role: "user",
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "User registered");
        });
    });

    describe("POST /login", () => {
        it("should log in a user and return tokens", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([[mockUser]]);

            const response = await request(app).post("/api/v1/auth/login").send({
                email: "johndoe@example.com",
                password: "password123",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("accessToken");
        });
    });

    describe("POST /refresh", () => {
        it("should refresh access token", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([[{ token: mockToken }]]);

            const response = await request(app).post("/api/v1/auth/refresh").send({
                refreshToken: mockToken,
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("accessToken");
        });
    });

    describe("POST /logout", () => {
        it("should log out a user and clear cookies", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([{}]);

            const response = await request(app).post("/api/v1/auth/logout").set("Cookie", [`refreshToken=${mockToken}`]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Logged out successfully");
        });
    });

    describe("GET /user/:id", () => {
        it("should get user details by ID", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([[mockUser]]);

            const response = await request(app)
                .get("/api/v1/auth/user/1")
                .set("Authorization", `Bearer ${mockToken}`)
                .set("Cookie", [`accessToken=${mockToken}`]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("email", "johndoe@example.com");
        });

        it("should return 401 if token is missing", async () => {
            const response = await request(app).get("/api/v1/auth/user/1");
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Access denied, token missing");
        });

        it("should return 403 if token is invalid", async () => {
            const response = await request(app)
                .get("/api/v1/auth/user/1")
                .set("Authorization", "Bearer invalidtoken");
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("message", "Invalid token");
        });
    });
});