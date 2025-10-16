// user-service/app.js
import express from "express";
import userRouter from "./routes/user.js";

const app = express();
app.use(express.json());
app.use("/users", userRouter);

// simple health
app.get("/health", (req, res) => res.json({ status: "ok", service: "user" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`User service listening on ${PORT}`));
