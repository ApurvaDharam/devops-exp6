// user-service/tests/user.test.js
import request from "supertest";
import express from "express";
import userRouter from "../routes/user.js";

const app = express();
app.use(express.json());
app.use("/users", userRouter);

describe("User API", () => {
  it("GET /users returns array", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /users/1 returns user", async () => {
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name");
  });

  it("GET /users/999 returns 404", async () => {
    const res = await request(app).get("/users/999");
    expect(res.status).toBe(404);
  });
});
