import { Sequelize,QueryTypes } from "sequelize";
import sequelize from "../../config/db";

describe("Database Connection", () => {
    it("should connect to the database successfully", async () => {
        try {
            await sequelize.authenticate();
            expect(true).toBe(true);
        } catch (error) {
            expect(error).toBeUndefined();
        }
    });

    it("should have the correct database configuration", () => {
        expect(sequelize.getDialect()).toBe("postgres");
        expect(sequelize.config.database).toBe(process.env.DB_DATABASE);
        expect(sequelize.config.username).toBe(process.env.DB_USER);
        expect(sequelize.config.host).toBe(process.env.DB_HOST);
    });
});

describe("Database Queries", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should insert a user into the database", async () => {
        const [result] = await sequelize.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            {
                bind: ["Test User", "test@example.com", "hashedpassword", "user"],
                type: QueryTypes.INSERT,
            }
        );

        expect(result).toHaveProperty("name", "Test User");
        expect(result).toHaveProperty("email", "test@example.com");
        expect(result).toHaveProperty("role", "user");
    });

    it("should retrieve a user from the database", async () => {
        const [result] = await sequelize.query(
            "SELECT * FROM users WHERE email = $1",
            {
                bind: ["test@example.com"],
                type: QueryTypes.SELECT,
            }
        );

        expect(result).toHaveProperty("name", "Test User");
        expect(result).toHaveProperty("email", "test@example.com");
        expect(result).toHaveProperty("role", "user");
    });

    it("should update a user in the database", async () => {
        const [result] = await sequelize.query(
            "UPDATE users SET name = $1 WHERE email = $2 RETURNING *",
            {
                bind: ["Updated User", "test@example.com"],
                type: QueryTypes.UPDATE,
            }
        );

        expect(result).toHaveProperty("name", "Updated User");
        expect(result).toHaveProperty("email", "test@example.com");
    });

    it("should delete a user from the database", async () => {
        const result = await sequelize.query(
            "DELETE FROM users WHERE email = $1 RETURNING *",
            {
                bind: ["test@example.com"],
                type: QueryTypes.DELETE,
            }
        );

        expect(result).toHaveProperty("email", "test@example.com");
    });
});
