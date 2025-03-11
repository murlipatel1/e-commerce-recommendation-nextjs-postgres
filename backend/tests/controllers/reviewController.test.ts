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

const mockReview = {
    id: 1,
    user_id: mockUser.id,
    product_id: 1,
    rating: 5,
    comment: "Great product!",
    created_at: new Date(),
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

describe("Review Controller", () => {
    describe("POST /api/v1/reviews", () => {
        it("should add a review", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([[mockReview]]);

            const response = await request(app)
                .post("/api/v1/reviews")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ product_id: 1, rating: 5, comment: "Great product!" });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("comment", "Great product!");
        });

        it("should return 500 if there is an error adding the review", async () => {
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .post("/api/v1/reviews")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ product_id: 1, rating: 5, comment: "Great product!" });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Error adding review");
        });
    });

    describe("GET /api/v1/reviews/:product_id", () => {
        it("should get reviews for a product", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([mockReview]);

            const response = await request(app).get("/api/v1/reviews/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockReview]);
        });

        it("should return 500 if there is an error fetching reviews", async () => {
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app).get("/api/v1/reviews/1");

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Error fetching reviews");
        });
    });
});
