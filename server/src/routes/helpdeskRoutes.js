// server/src/routes/helpdeskRoutes.js
import express from "express";
import { initialHelpdeskTickets } from "../data/helpdeskData.js";

const router = express.Router();

let helpdeskTickets = [...initialHelpdeskTickets];

/**
 * GET /api/helpdesk/tickets
 * Simulates Helpdesk REST API endpoint
 */
router.get("/tickets", (req, res, next) => {
  try {
    let result = [...helpdeskTickets];

    if (req.query.empId) {
      result = result.filter((t) => t.assignee.empId === req.query.empId);
    }
    if (req.query.status) {
      result = result.filter((t) => t.ticketStatus === req.query.status);
    }

    res.json({
      success: true,
      source: "Helpdesk (Zendesk / Jira)",
      count: result.length,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/helpdesk/tickets/:id
 */
router.get("/tickets/:id", (req, res, next) => {
  try {
    const ticket = helpdeskTickets.find((t) => t.ticketId === req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: `Helpdesk Ticket ${req.params.id} not found` });
    }
    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/helpdesk/tickets/:id/status
 */
router.patch("/tickets/:id/status", (req, res, next) => {
  try {
    const { status } = req.body;
    const ticketIndex = helpdeskTickets.findIndex((t) => t.ticketId === req.params.id);
    if (ticketIndex === -1) {
      return res.status(404).json({ success: false, message: `Helpdesk Ticket ${req.params.id} not found` });
    }

    helpdeskTickets[ticketIndex] = {
      ...helpdeskTickets[ticketIndex],
      ticketStatus: status || helpdeskTickets[ticketIndex].ticketStatus,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, message: "Helpdesk ticket updated", data: helpdeskTickets[ticketIndex] });
  } catch (error) {
    next(error);
  }
});

export { router as helpdeskRouter, helpdeskTickets };
