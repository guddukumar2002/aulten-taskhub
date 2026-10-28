// server/src/routes/crmRoutes.js
import express from "express";
import { initialCrmTasks } from "../data/crmData.js";
import { chaosService } from "../services/chaosService.js";

const router = express.Router();

// In-memory mutable store for demo
let crmTasks = [...initialCrmTasks];

/**
 * GET /api/crm/tasks
 * Simulates CRM REST API endpoint
 */
router.get("/tasks", async (req, res, next) => {
  try {
    await chaosService.applyLatency();
    chaosService.checkCrmFailure();

    let result = [...crmTasks];

    // Optional query filters
    if (req.query.employeeId) {
      result = result.filter((t) => t.assignedEmployee.id === req.query.employeeId);
    }
    if (req.query.status) {
      result = result.filter((t) => t.status === req.query.status);
    }

    res.json({
      success: true,
      source: "CRM (Zoho / Salesforce)",
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
router.get("/tasks/:id", async (req, res, next) => {
  try {
    await chaosService.applyLatency();
    chaosService.checkCrmFailure();

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
router.patch("/tasks/:id/status", async (req, res, next) => {
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
