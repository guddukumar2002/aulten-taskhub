// server/src/routes/taskRoutes.js
import express from "express";
import { crmTasks } from "./crmRoutes.js";
import { helpdeskTasks } from "./helpdeskRoutes.js";
import { calculatePriority } from "../services/prioritizer.js";

const router = express.Router();

/**
 * GET /api/tasks
 * Unified aggregator endpoint fetching and normalizing tasks from both CRM and Helpdesk
 */
router.get("/tasks", (req, res) => {
  const serviceHealth = {
    crm: { healthy: true, error: null, count: 0 },
    helpdesk: { healthy: true, error: null, count: 0 }
  };

  let rawCrmList = [];
  let rawHelpdeskList = [];

  const simulate = req.query.simulate_error;

  // 1. Fetch CRM Tasks
  if (simulate === "crm" || simulate === "both" || simulate === "all") {
    serviceHealth.crm.healthy = false;
    serviceHealth.crm.error = "Simulated CRM upstream service failure (HTTP 500)";
  } else {
    try {
      rawCrmList = [...crmTasks];
      serviceHealth.crm.count = rawCrmList.length;
    } catch (err) {
      serviceHealth.crm.healthy = false;
      serviceHealth.crm.error = err.message || "Failed to load CRM tasks";
    }
  }

  // 2. Fetch Helpdesk Tasks
  if (simulate === "helpdesk" || simulate === "both" || simulate === "all") {
    serviceHealth.helpdesk.healthy = false;
    serviceHealth.helpdesk.error = "Simulated Helpdesk upstream service failure (HTTP 503)";
  } else {
    try {
      rawHelpdeskList = [...helpdeskTasks];
      serviceHealth.helpdesk.count = rawHelpdeskList.length;
    } catch (err) {
      serviceHealth.helpdesk.healthy = false;
      serviceHealth.helpdesk.error = err.message || "Failed to load Helpdesk tasks";
    }
  }

  // If both failed, return 503
  if (!serviceHealth.crm.healthy && !serviceHealth.helpdesk.healthy) {
    return res.status(503).json({
      success: false,
      message: "Both upstream services (CRM & Helpdesk) are temporarily unavailable.",
      serviceHealth,
      tasks: []
    });
  }

  // Combine and prioritize
  const combined = [...rawCrmList, ...rawHelpdeskList];
  const evaluatedTasks = combined.map((task) => calculatePriority(task));

  // Filters
  let filtered = evaluatedTasks;
  const { employeeId, status, priority, source, search, sort } = req.query;

  if (employeeId && employeeId !== "all") {
    filtered = filtered.filter((t) => t.employeeId === employeeId);
  }

  if (status && status !== "all") {
    filtered = filtered.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  }

  if (priority && priority !== "all") {
    filtered = filtered.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
  }

  if (source && source !== "all") {
    filtered = filtered.filter((t) => t.source.toLowerCase() === source.toLowerCase());
  }

  if (search && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.metadata?.customer && t.metadata.customer.toLowerCase().includes(q)) ||
        (t.metadata?.requester && t.metadata.requester.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === "deadline_asc") {
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  } else if (sort === "priority_desc") {
    const weightMap = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    filtered.sort((a, b) => (weightMap[b.priority] || 0) - (weightMap[a.priority] || 0));
  } else if (sort === "title_asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default: Highest Priority Score First, then Earliest Deadline
    filtered.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  res.json({
    success: true,
    count: filtered.length,
    totalUnifiedCount: evaluatedTasks.length,
    serviceHealth,
    tasks: filtered
  });
});

/**
 * GET /api/employees
 */
router.get("/employees", (req, res) => {
  const empMap = new Map();

  crmTasks.forEach((t) => {
    if (!empMap.has(t.employeeId)) {
      empMap.set(t.employeeId, {
        id: t.employeeId,
        name: t.employeeName,
        avatar: t.employeeAvatar,
        crmCount: 1,
        helpdeskCount: 0
      });
    } else {
      empMap.get(t.employeeId).crmCount += 1;
    }
  });

  helpdeskTasks.forEach((t) => {
    if (!empMap.has(t.employeeId)) {
      empMap.set(t.employeeId, {
        id: t.employeeId,
        name: t.employeeName,
        avatar: t.employeeAvatar,
        crmCount: 0,
        helpdeskCount: 1
      });
    } else {
      empMap.get(t.employeeId).helpdeskCount += 1;
    }
  });

  const employees = Array.from(empMap.values()).map((e) => ({
    ...e,
    totalAssigned: e.crmCount + e.helpdeskCount
  }));

  res.json({
    success: true,
    count: employees.length,
    employees
  });
});

/**
 * GET /api/analytics
 * Dynamic executive KPI summary and distributions for Recharts
 */
router.get("/analytics", (req, res) => {
  const allTasks = [...crmTasks, ...helpdeskTasks].map((t) => calculatePriority(t));

  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === "Completed").length;
  const inProgress = allTasks.filter((t) => t.status === "In Progress").length;
  const toDo = allTasks.filter((t) => t.status === "To Do").length;
  const blocked = allTasks.filter((t) => t.status === "Blocked").length;

  const overdue = allTasks.filter((t) => t.deadlineStatus === "overdue" && t.status !== "Completed").length;
  const dueToday = allTasks.filter((t) => t.deadlineStatus === "due_today" && t.status !== "Completed").length;
  const urgent = allTasks.filter((t) => t.priority === "Urgent" && t.status !== "Completed").length;

  // Chart distribution data for Recharts
  const statusDistribution = [
    { name: "To Do", value: toDo, color: "#64748b" },
    { name: "In Progress", value: inProgress, color: "#3b82f6" },
    { name: "Blocked", value: blocked, color: "#f59e0b" },
    { name: "Completed", value: completed, color: "#10b981" }
  ];

  const priorityDistribution = [
    { name: "Urgent", count: allTasks.filter((t) => t.priority === "Urgent").length, color: "#ef4444" },
    { name: "High", count: allTasks.filter((t) => t.priority === "High").length, color: "#f97316" },
    { name: "Medium", count: allTasks.filter((t) => t.priority === "Medium").length, color: "#0ea5e9" },
    { name: "Low", count: allTasks.filter((t) => t.priority === "Low").length, color: "#94a3b8" }
  ];

  res.json({
    success: true,
    total,
    overdue,
    dueToday,
    completed,
    activeTasks: total - completed,
    inProgress,
    toDo,
    blocked,
    urgent,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    sourceBreakdown: {
      crm: crmTasks.length,
      helpdesk: helpdeskTasks.length
    },
    statusDistribution,
    priorityDistribution
  });
});

/**
 * PATCH /api/tasks/:id/status
 */
router.patch("/tasks/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (id.startsWith("CRM-")) {
    const idx = crmTasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      crmTasks[idx].status = status || crmTasks[idx].status;
      const updated = calculatePriority(crmTasks[idx]);
      return res.json({ success: true, message: `CRM task ${id} updated`, task: updated });
    }
  } else if (id.startsWith("HD-")) {
    const idx = helpdeskTasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      helpdeskTasks[idx].status = status || helpdeskTasks[idx].status;
      const updated = calculatePriority(helpdeskTasks[idx]);
      return res.json({ success: true, message: `Helpdesk task ${id} updated`, task: updated });
    }
  }

  return res.status(404).json({ success: false, message: `Task ${id} not found` });
});

export { router as taskRouter };
