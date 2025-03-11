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

const mockToken = sign({ id: mockUser.id, email: mockUser.email, role: mockUser.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

jest.mock("../../config/db", () => {
    return {
        query: jest.fn(),
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Recommendation Controller", () => {
    describe("GET /api/v1/recommendations", () => {
        it("should get recommendations for the logged-in user", async () => {
            const mockRecommendations = [
                { id: 1, user_id: mockUser.id, product_id: 1, category: "Electronics", visit_count: 1 },
            ];
            (sequelize.query as jest.Mock).mockResolvedValue(mockRecommendations);

            const response = await request(app)
                .get("/api/v1/recommendations")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockRecommendations);
        });

        it("should return 500 if there is an error fetching recommendations", async () => {
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .get("/api/v1/recommendations")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Error fetching recommendations");
        });
    });

    describe("POST /api/v1/recommendations/update", () => {
        it("should update recommendations based on category visits", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([]);

            const response = await request(app)
                .post("/api/v1/recommendations/update")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ category: "Electronics", product_id: 1 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Recommendation updated successfully");
        });

        it("should return 500 if there is an error updating recommendations", async () => {
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .post("/api/v1/recommendations/update")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ category: "Electronics", product_id: 1 });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Error updating recommendation");
        });
    });
});
