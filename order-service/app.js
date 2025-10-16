// order-service/app.js
import express from "express";
import orderRouter from "./routes/order.js";

const app = express();
app.use(express.json());
app.use("/orders", orderRouter);

app.get("/health", (req, res) => res.json({ status: "ok", service: "order" }));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Order service listening on ${PORT}`));
