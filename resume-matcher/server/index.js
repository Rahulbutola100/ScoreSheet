import "dotenv/config";
import express from "express";
import cors from "cors";
import matchRouter from "./routes/match.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", matchRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`Resume Matcher server running on http://localhost:${PORT}`);
});
