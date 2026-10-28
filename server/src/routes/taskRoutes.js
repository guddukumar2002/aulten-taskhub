// server/src/routes/taskRoutes.js
import express from "express";
import { crmTasks } from "./crmRoutes.js";
import { helpdeskTickets } from "./helpdeskRoutes.js";
import { normalizeCrmTask, normalizeHelpdeskTicket, calculatePriority } from "../services/prioritizer.js";

const router = express.Router();

/**
 * GET /api/tasks
 * Unified aggregator endpoint fetching from both CRM & Helpdesk
 * Normalizes schemas, calculates priority, and applies filters
 */
router.get("/tasks", (req, res) => {
  const serviceHealth = {
    crm: { healthy: true, error: null, count: 0 },
    helpdesk: { healthy: true, error: null, count: 0 }
  };

  let rawCrmList = [];
  let rawHelpdeskList = [];

  // Ingest from CRM mock source
  try {
    rawCrmList = [...crmTasks];
    serviceHealth.crm.count = rawCrmList.length;
  } catch (err) {
    serviceHealth.crm.healthy = false;
    serviceHealth.crm.error = err.message || "CRM service unavailable";
  }

  // Ingest from Helpdesk mock source
  try {
    rawHelpdeskList = [...helpdeskTickets];
    serviceHealth.helpdesk.count = rawHelpdeskList.length;
  } catch (err) {
    serviceHealth.helpdesk.healthy = false;
    serviceHealth.helpdesk.error = err.message || "Helpdesk service unavailable";
  }

  // If both failed, return resilient error response
  if (!serviceHealth.crm.healthy && !serviceHealth.helpdesk.healthy) {
    return res.status(503).json({
      success: false,
      message: "Upstream services (CRM & Helpdesk) are temporarily unavailable.",
      serviceHealth,
      tasks: []
    });
  }

  // 1. Normalize
  const normalizedCrm = rawCrmList.map(normalizeCrmTask);
  const normalizedHelpdesk = rawHelpdeskList.map(normalizeHelpdeskTicket);

  // 2. Combine
  let unifiedTasks = [...normalizedCrm, ...normalizedHelpdesk];

  // 3. Prioritize with mathematical engine
  const evaluatedTasks = unifiedTasks.map((task) => calculatePriority(task));

  // 4. Apply Filters
  let filtered = evaluatedTasks;
  const { employeeId, status, source, urgency, search, sort } = req.query;

  if (employeeId && employeeId !== "all") {
    filtered = filtered.filter((t) => t.assignedTo.id === employeeId);
  }

  if (status && status !== "all") {
    filtered = filtered.filter((t) => t.status === status);
  }

  if (source && source !== "all") {
    filtered = filtered.filter((t) => t.source.toLowerCase() === source.toLowerCase());
  }

  if (urgency && urgency !== "all") {
    filtered = filtered.filter((t) => t.urgency.toLowerCase() === urgency.toLowerCase());
  }

  if (search && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.assignedTo.name.toLowerCase().includes(q) ||
        (t.metadata.customer && t.metadata.customer.toLowerCase().includes(q)) ||
        (t.metadata.requester && t.metadata.requester.toLowerCase().includes(q)) ||
        (t.metadata.tags && t.metadata.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  }

  // 5. Sorting
  if (sort === "deadline_asc") {
    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (sort === "urgency_desc") {
    const urgencyMap = { critical: 4, high: 3, medium: 2, low: 1 };
    filtered.sort((a, b) => (urgencyMap[b.urgency] || 0) - (urgencyMap[a.urgency] || 0));
  } else if (sort === "title_asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default: Smart Priority Score Descending
    filtered.sort((a, b) => b.priorityScore - a.priorityScore);
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
 * Unique list of employees across all systems
 */
router.get("/employees", (req, res) => {
  const empMap = new Map();

  crmTasks.forEach((t) => {
    const emp = t.assignedEmployee;
    if (!empMap.has(emp.id)) {
      empMap.set(emp.id, { ...emp, crmCount: 1, helpdeskCount: 0 });
    } else {
      empMap.get(emp.id).crmCount += 1;
    }
  });

  helpdeskTickets.forEach((t) => {
    const emp = t.assignee;
    if (!empMap.has(emp.empId)) {
      empMap.set(emp.empId, {
        id: emp.empId,
        name: emp.fullName,
        email: emp.email,
        role: emp.role,
        department: emp.department,
        avatar: emp.avatar,
        crmCount: 0,
        helpdeskCount: 1
      });
    } else {
      empMap.get(emp.empId).helpdeskCount += 1;
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
 * KPI summary metrics
 */
router.get("/analytics", (req, res) => {
  const normCrm = crmTasks.map(normalizeCrmTask);
  const normHelpdesk = helpdeskTickets.map(normalizeHelpdeskTicket);
  const allTasks = [...normCrm, ...normHelpdesk].map((t) => calculatePriority(t));

  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === "completed").length;
  const inProgress = allTasks.filter((t) => t.status === "in_progress").length;
  const pending = allTasks.filter((t) => t.status === "pending").length;
  const blocked = allTasks.filter((t) => t.status === "blocked").length;

  const overdue = allTasks.filter((t) => t.deadlineStatus === "overdue" && t.status !== "completed").length;
  const dueToday = allTasks.filter((t) => (t.deadlineStatus === "due_today" || t.deadlineStatus === "due_soon_6h") && t.status !== "completed").length;
  const critical = allTasks.filter((t) => t.urgency === "critical" && t.status !== "completed").length;

  res.json({
    success: true,
    total,
    completed,
    inProgress,
    pending,
    blocked,
    overdue,
    dueToday,
    critical,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    sourceBreakdown: {
      crm: normCrm.length,
      helpdesk: normHelpdesk.length
    },
    urgencyBreakdown: {
      critical: allTasks.filter((t) => t.urgency === "critical").length,
      high: allTasks.filter((t) => t.urgency === "high").length,
      medium: allTasks.filter((t) => t.urgency === "medium").length,
      low: allTasks.filter((t) => t.urgency === "low").length
    }
  });
});

/**
 * PATCH /api/tasks/:id/status
 * Unified status update
 */
router.patch("/tasks/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (id.startsWith("CRM-")) {
    const idx = crmTasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      let crmStatus = status;
      if (status === "pending") crmStatus = "pending";
      if (status === "in_progress") crmStatus = "in_progress";
      if (status === "completed") crmStatus = "completed";
      if (status === "blocked") crmStatus = "blocked";

      crmTasks[idx].status = crmStatus;
      const updated = calculatePriority(normalizeCrmTask(crmTasks[idx]));
      return res.json({ success: true, message: `CRM task ${id} updated`, task: updated });
    }
  } else if (id.startsWith("HD-")) {
    const idx = helpdeskTickets.findIndex((t) => t.ticketId === id);
    if (idx !== -1) {
      let hdStatus = status;
      if (status === "pending") hdStatus = "open";
      if (status === "in_progress") hdStatus = "investigating";
      if (status === "completed") hdStatus = "resolved";
      if (status === "blocked") hdStatus = "waiting_customer";

      helpdeskTickets[idx].ticketStatus = hdStatus;
      const updated = calculatePriority(normalizeHelpdeskTicket(helpdeskTickets[idx]));
      return res.json({ success: true, message: `Helpdesk ticket ${id} updated`, task: updated });
    }
  }

  return res.status(404).json({ success: false, message: `Task ${id} not found` });
});

export { router as taskRouter };
