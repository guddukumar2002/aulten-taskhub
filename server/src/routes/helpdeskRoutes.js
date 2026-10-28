// server/src/routes/helpdeskRoutes.js
import express from "express";
import { initialHelpdeskTasks } from "../data/helpdeskData.js";

const router = express.Router();
let helpdeskTasks = [...initialHelpdeskTasks];

const getTasksHandler = (req, res, next) => {
  try {
    if (req.query.simulate_error === "true" || req.query.simulate_error === "helpdesk") {
      return res.status(503).json({
        success: false,
        source: "Helpdesk",
        message: "Simulated Helpdesk upstream service failure (HTTP 503)"
      });
    }

    let result = [...helpdeskTasks];

    if (req.query.employeeId) {
      result = result.filter((t) => t.employeeId === req.query.employeeId);
    }
    if (req.query.status) {
      result = result.filter((t) => t.status.toLowerCase() === req.query.status.toLowerCase());
    }

    res.json({
      success: true,
      source: "Helpdesk",
      count: result.length,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/helpdesk/tasks and alias /api/helpdesk/tickets
 */
router.get("/tasks", getTasksHandler);
router.get("/tickets", getTasksHandler);

/**
 * GET /api/helpdesk/tasks/:id
 */
router.get("/tasks/:id", (req, res, next) => {
  try {
    const task = helpdeskTasks.find((t) => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: `Helpdesk Task ${req.params.id} not found` });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/helpdesk/tasks/:id/status
 */
router.patch("/tasks/:id/status", (req, res, next) => {
  try {
    const { status } = req.body;
    const taskIndex = helpdeskTasks.findIndex((t) => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: `Helpdesk Task ${req.params.id} not found` });
    }

    helpdeskTasks[taskIndex] = {
      ...helpdeskTasks[taskIndex],
      status: status || helpdeskTasks[taskIndex].status,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, message: "Helpdesk task updated", data: helpdeskTasks[taskIndex] });
  } catch (error) {
    next(error);
  }
});

export { router as helpdeskRouter, helpdeskTasks };
