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

const mockOrder = {
    id: 1,
    user_id: mockUser.id,
    total_price: 100,
    status: "pending",
};

const mockToken = sign({ id: mockUser.id, email: mockUser.email, role: mockUser.role }, "jwt-secret", { expiresIn: "1d" });

jest.mock("../../config/db", () => {
    return {
        query: jest.fn(),
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Order Controller", () => {
    describe("POST /api/v1/orders", () => {
        it("should place a new order", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([[mockOrder]]);

            const response = await request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ user_id: mockUser.id, total_price: 100 });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("total_price", 100);
        });

        it("should return 500 if there is an error placing the order", async () => {
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .post("/api/v1/orders")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ user_id: mockUser.id, total_price: 100 });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Error placing order");
        });
    });

    describe("GET /api/v1/orders", () => {
        it("should get orders of the logged-in user", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([mockOrder]);

            const response = await request(app)
                .get("/api/v1/orders")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockOrder]);
        });

        it("should return 500 if there is an error fetching orders", async () => {
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .get("/api/v1/orders")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Error fetching orders");
        });
    });
});
