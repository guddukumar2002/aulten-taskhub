// server/src/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { crmRouter } from "./routes/crmRoutes.js";
import { helpdeskRouter } from "./routes/helpdeskRoutes.js";
import { taskRouter } from "./routes/taskRoutes.js";
import { portalRouter } from "./routes/portalRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "Aulten Employee Task Dashboard API Aggregator",
    version: "1.0.0"
  });
});

// Mount Routes
app.use("/portal", portalRouter);
app.use("/api/crm", crmRouter);
app.use("/api/helpdesk", helpdeskRouter);
app.use("/api", taskRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} does not exist.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    status,
    message: err.message || "An unexpected server error occurred.",
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Aulten TaskHub Server running on port ${PORT}`);
  console.log(`📡 Health Check:     http://localhost:${PORT}/api/health`);
  console.log(`📋 Unified Tasks:    http://localhost:${PORT}/api/tasks`);
  console.log(`💼 CRM Mock API:     http://localhost:${PORT}/api/crm/tasks`);
  console.log(`🎧 Helpdesk Mock API: http://localhost:${PORT}/api/helpdesk/tickets`);
  console.log(`=======================================================`);
});
