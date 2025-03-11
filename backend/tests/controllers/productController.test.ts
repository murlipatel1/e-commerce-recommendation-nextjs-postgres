import request from "supertest";
import app from "../../index";
import sequelize from "../../config/db";
import { sign } from "jsonwebtoken";

const mockAdmin = {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "hashedpassword",
    role: "admin",
};

const mockUser = {
    id: 2,
    name: "Regular User",
    email: "user@example.com",
    password: "hashedpassword",
    role: "user",
};

const mockProduct = {
    id: 1,
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
    category: "Test Category",
    photo_url: "http://example.com/photo.jpg",
};

const adminToken = sign({ id: mockAdmin.id, email: mockAdmin.email, role: mockAdmin.role }, "jwt-secret", { expiresIn: "1d" });
const userToken = sign({ id: mockUser.id, email: mockUser.email, role: mockUser.role }, "jwt-secret", { expiresIn: "1d" });

jest.mock("../../config/db", () => {
    return {
        query: jest.fn(),
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Product Controller", () => {
    describe("POST /api/v1/products", () => {
        it("should create a new product", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([[mockProduct]]);

            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(mockProduct);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("name", "Test Product");
        });

        it("should return 403 if the user is not an admin", async () => {
            const response = await request(app)
                .post("/api/v1/products")
                .set("Authorization", `Bearer ${userToken}`)
                .send(mockProduct);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    describe("GET /api/v1/products", () => {
        it("should get all products", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([mockProduct]);

            const response = await request(app).get("/api/v1/products");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockProduct]);
        });

        it("should return 500 if there is an error fetching products", async () => {
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app).get("/api/v1/products");

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("message", "Error fetching products");
        });
    });

    describe("GET /api/v1/products/:id", () => {
        it("should get a product by ID", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([mockProduct]);

            const response = await request(app).get("/api/v1/products/1");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("name", "Test Product");
        });

        it("should return 404 if the product is not found", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([]);

            const response = await request(app).get("/api/v1/products/1");

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Product not found");
        });
    });

    describe("DELETE /api/v1/products/:id", () => {
        it("should delete a product by ID", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([{}]);

            const response = await request(app)
                .delete("/api/v1/products/1")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Product deleted successfully");
        });

        it("should return 403 if the user is not an admin", async () => {
            const response = await request(app)
                .delete("/api/v1/products/1")
                .set("Authorization", `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });

    describe("PUT /api/v1/products/:id", () => {
        it("should update a product by ID", async () => {
            (sequelize.query as jest.Mock).mockResolvedValue([{}]);

            const response = await request(app)
                .put("/api/v1/products/1")
                .set("Authorization", `Bearer ${adminToken}`)
                .send(mockProduct);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Product updated successfully");
        });

        it("should return 403 if the user is not an admin", async () => {
            const response = await request(app)
                .put("/api/v1/products/1")
                .set("Authorization", `Bearer ${userToken}`)
                .send(mockProduct);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("message", "Unauthorized");
        });
    });
});
