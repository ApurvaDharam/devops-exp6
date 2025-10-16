// order-service/routes/order.js
import express from "express";
const router = express.Router();

const orders = [
  { id: 1, item: "Laptop", qty: 1 },
  { id: 2, item: "Mouse", qty: 2 },
];

router.get("/", (req, res) => res.json(orders));

router.get("/:id", (req, res) => {
  const o = orders.find((x) => x.id === Number(req.params.id));
  if (!o) return res.status(404).json({ error: "not found" });
  res.json(o);
});

export default router;
