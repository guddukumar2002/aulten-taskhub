// server/src/routes/crmRoutes.js
import express from "express";
import { initialCrmTasks } from "../data/crmData.js";

const router = express.Router();
let crmTasks = [...initialCrmTasks];

/**
 * GET /api/crm/tasks
 * Exposes mock CRM REST API tasks
 * Supports development simulation param: ?simulate_error=true
 */
router.get("/tasks", (req, res, next) => {
  try {
    if (req.query.simulate_error === "true" || req.query.simulate_error === "crm") {
      return res.status(500).json({
        success: false,
        source: "CRM",
        message: "Simulated CRM upstream service failure (HTTP 500)"
      });
    }

    let result = [...crmTasks];

    if (req.query.employeeId) {
      result = result.filter((t) => t.employeeId === req.query.employeeId);
    }
    if (req.query.status) {
      result = result.filter((t) => t.status.toLowerCase() === req.query.status.toLowerCase());
    }

    res.json({
      success: true,
      source: "CRM",
      count: result.length,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/crm/tasks/:id
 */
router.get("/tasks/:id", (req, res, next) => {
  try {
    const task = crmTasks.find((t) => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: `CRM Task ${req.params.id} not found` });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/crm/tasks/:id/status
 */
router.patch("/tasks/:id/status", (req, res, next) => {
  try {
    const { status } = req.body;
    const taskIndex = crmTasks.findIndex((t) => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: `CRM Task ${req.params.id} not found` });
    }

    crmTasks[taskIndex] = {
      ...crmTasks[taskIndex],
      status: status || crmTasks[taskIndex].status,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, message: "CRM task updated", data: crmTasks[taskIndex] });
  } catch (error) {
    next(error);
  }
});

export { router as crmRouter, crmTasks };
