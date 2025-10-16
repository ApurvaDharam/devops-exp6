// user-service/routes/user.js
import express from "express";
const router = express.Router();

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

router.get("/", (req, res) => res.json(users));

router.get("/:id", (req, res) => {
  const u = users.find((x) => x.id === Number(req.params.id));
  if (!u) return res.status(404).json({ error: "not found" });
  res.json(u);
});

export default router;
