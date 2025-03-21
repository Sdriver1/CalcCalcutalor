import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import {
  getDerivative,
  getIntegral,
  evaluateExpression,
} from "../calculator/calculator.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "web")));
app.use(express.json()); 

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Math APIs
app.get("/api/derivative", (req, res) => {
  const { expr, variable } = req.query;
  const result = getDerivative(expr, variable);
  res.json({ result });
});

app.get("/api/integral", (req, res) => {
  const { expr, variable, lower, upper } = req.query;
  res.json({ result: getIntegral(expr, variable, lower, upper) });
});

app.get("/api/evaluate", (req, res) => {
  const { expr } = req.query;
  res.json({ result: evaluateExpression(expr) });
});

app.post("/api/solve", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Missing question" });

  try {
    const aiRes = await axios.post("http://localhost:5001/solve", { question });
    res.json(aiRes.data);
  } catch (error) {
    console.error("AI Helper Error:", error.message);
    res.status(500).json({ error: "AI helper failed to respond" });
  }
});
