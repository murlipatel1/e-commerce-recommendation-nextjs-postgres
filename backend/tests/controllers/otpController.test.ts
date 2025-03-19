import request from "supertest";
import app from "../../index";
import sequelize from "../../config/db";

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe("OTP Controller", () => {
  describe("POST /api/v1/otp/forgot-password", () => {
    it("should send an OTP to the user's email", async () => {
      const response = await request(app)
        .post("/api/v1/otp/forgot-password")
        .send({ email: "test@example.com" });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("OTP sent to email");
    });

    it("should return 404 if the user is not found", async () => {
      const response = await request(app)
        .post("/api/v1/otp/forgot-password")
        .send({ email: "nonexistent@example.com" });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("POST /api/v1/otp/reset-password", () => {
    it("should reset the user's password", async () => {
      const response = await request(app)
        .post("/api/v1/otp/reset-password")
        .send({
          email: "test@example.com",
          otp: "123456",
          newPassword: "newpassword123",
        });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password reset successful");
    });

    it("should return 400 for invalid or expired OTP", async () => {
      const response = await request(app)
        .post("/api/v1/otp/reset-password")
        .send({
          email: "test@example.com",
          otp: "invalidotp",
          newPassword: "newpassword123",
        });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid or expired OTP");
    });
  });
});
