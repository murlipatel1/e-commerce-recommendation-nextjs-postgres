import request from "supertest";
import app from "../../index";
import sequelize from "../../config/db";

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Dashboard Controller", () => {
  describe("GET /api/v1/dashboard/sales-data", () => {
    it("should return sales data", async () => {
      const response = await request(app).get("/api/v1/dashboard/sales-data");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/user-registrations", () => {
    it("should return user registration data", async () => {
      const response = await request(app).get("/api/v1/dashboard/user-registrations");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/product-performance", () => {
    it("should return product performance data", async () => {
      const response = await request(app).get("/api/v1/dashboard/product-performance");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/order-stats", () => {
    it("should return order statistics", async () => {
      const response = await request(app).get("/api/v1/dashboard/order-stats");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/v1/dashboard/recommendations-data", () => {
    it("should return recommendations data", async () => {
      const response = await request(app).get("/api/v1/dashboard/recommendations-data");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
