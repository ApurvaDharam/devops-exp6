// order-service/tests/order.test.js
import request from "supertest";
import express from "express";
import orderRouter from "../routes/order.js";

const app = express();
app.use(express.json());
app.use("/orders", orderRouter);

describe("Order API", () => {
  it("GET /orders returns array", async () => {
    const res = await request(app).get("/orders");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /orders/1 returns order", async () => {
    const res = await request(app).get("/orders/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("item");
  });

  it("GET /orders/999 returns 404", async () => {
    const res = await request(app).get("/orders/999");
    expect(res.status).toBe(404);
  });
});
