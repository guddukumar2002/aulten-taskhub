import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { crmRouter } from "../server/src/routes/crmRoutes.js";
import { helpdeskRouter } from "../server/src/routes/helpdeskRoutes.js";
import { taskRouter } from "../server/src/routes/taskRoutes.js";
import { portalRouter } from "../server/src/routes/portalRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime(), timestamp: new Date().toISOString(), service: "Aulten Employee Task Dashboard API Aggregator", version: "1.0.0" });
});

app.use("/portal", portalRouter);
app.use("/api/crm", crmRouter);
app.use("/api/helpdesk", helpdeskRouter);
app.use("/api", taskRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.url} does not exist.` });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message || "Unexpected error", timestamp: new Date().toISOString() });
});

export default app;
