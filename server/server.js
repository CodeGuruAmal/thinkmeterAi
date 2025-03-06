import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// pwd = Evf33s2Ff1IGswOU;
