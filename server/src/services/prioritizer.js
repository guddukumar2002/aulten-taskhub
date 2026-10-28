// server/src/services/prioritizer.js

/**
 * Normalizes CRM task into unified schema
 */
export function normalizeCrmTask(crmTask) {
  const normalizedStatus = mapCrmStatus(crmTask.status);
  return {
    id: crmTask.id,
    rawId: crmTask.id,
    source: "CRM",
    sourcePlatform: "Zoho CRM / Salesforce",
    title: crmTask.title,
    assignedTo: {
      id: crmTask.assignedEmployee.id,
      name: crmTask.assignedEmployee.name,
      email: crmTask.assignedEmployee.email,
      role: crmTask.assignedEmployee.role,
      department: crmTask.assignedEmployee.department,
      avatar: crmTask.assignedEmployee.avatar
    },
    urgency: crmTask.urgency.toLowerCase(),
    status: normalizedStatus,
    rawStatus: crmTask.status,
    deadline: crmTask.dueDate,
    createdAt: crmTask.createdAt,
    sourceUrl: crmTask.sourceAppUrl,
    deepLink: `/mock-source/crm/${crmTask.id}`,
    metadata: {
      customer: crmTask.customerName,
      dealValue: crmTask.dealValue,
      stage: crmTask.stage,
      notes: crmTask.notes,
      tags: crmTask.tags || []
    }
  };
}

/**
 * Normalizes Helpdesk ticket into unified schema
 */
export function normalizeHelpdeskTicket(ticket) {
  const normalizedStatus = mapHelpdeskStatus(ticket.ticketStatus);
  return {
    id: ticket.ticketId,
    rawId: ticket.ticketId,
    source: "Helpdesk",
    sourcePlatform: "Zendesk / Jira Service",
    title: ticket.subject,
    assignedTo: {
      id: ticket.assignee.empId,
      name: ticket.assignee.fullName,
      email: ticket.assignee.email,
      role: ticket.assignee.role,
      department: ticket.assignee.department,
      avatar: ticket.assignee.avatar
    },
    urgency: ticket.severity.toLowerCase(),
    status: normalizedStatus,
    rawStatus: ticket.ticketStatus,
    deadline: ticket.resolutionDeadline,
    createdAt: ticket.createdTimestamp,
    sourceUrl: ticket.ticketDeepLink,
    deepLink: `/mock-source/helpdesk/${ticket.ticketId}`,
    metadata: {
      requester: ticket.requester,
      category: ticket.category,
      description: ticket.description,
      tags: ticket.tags || []
    }
  };
}

function mapCrmStatus(status) {
  switch (status?.toLowerCase()) {
    case "completed":
    case "closed":
      return "completed";
    case "in_progress":
      return "in_progress";
    case "blocked":
      return "blocked";
    case "pending":
    default:
      return "pending";
  }
}

function mapHelpdeskStatus(status) {
  switch (status?.toLowerCase()) {
    case "resolved":
    case "closed":
      return "completed";
    case "investigating":
      return "in_progress";
    case "waiting_customer":
      return "blocked";
    case "open":
    default:
      return "pending";
  }
}

/**
 * Prioritization Engine: Calculates mathematical priority score based on:
 * 1. Base Urgency weight (Critical = 100, High = 75, Medium = 45, Low = 20)
 * 2. Deadline Proximity boost (Overdue +120 + decay penalty, <6h +90, <24h +60, <72h +35, <1w +15, >1w +5)
 * 3. Status Weight (Active tasks elevated, completed tasks demoted by -1000)
 */
export function calculatePriority(task, referenceTime = new Date()) {
  const refTime = new Date(referenceTime).getTime();
  const deadlineTime = new Date(task.deadline).getTime();
  const diffHours = (deadlineTime - refTime) / (1000 * 60 * 60);

  // 1. Urgency score
  let urgencyWeight = 20;
  switch (task.urgency) {
    case "critical":
      urgencyWeight = 100;
      break;
    case "high":
      urgencyWeight = 75;
      break;
    case "medium":
      urgencyWeight = 45;
      break;
    case "low":
    default:
      urgencyWeight = 20;
      break;
  }

  // 2. Deadline factor
  let deadlineScore = 0;
  let deadlineStatus = "upcoming";
  let timeRemainingFormatted = "";

  const isCompleted = task.status === "completed";

  if (diffHours < 0) {
    // Overdue
    deadlineStatus = "overdue";
    const hoursOverdue = Math.abs(diffHours);
    if (hoursOverdue < 24) {
      timeRemainingFormatted = `Overdue by ${Math.floor(hoursOverdue)}h`;
    } else {
      const daysOverdue = Math.floor(hoursOverdue / 24);
      timeRemainingFormatted = `Overdue by ${daysOverdue}d ${Math.floor(hoursOverdue % 24)}h`;
    }

    if (!isCompleted) {
      // Overdue penalty scales with time elapsed (up to +50 additional pts)
      const escalationPenalty = Math.min(50, Math.floor(hoursOverdue * 1.5));
      deadlineScore = 120 + escalationPenalty;
    } else {
      deadlineScore = 0;
    }
  } else if (diffHours <= 6) {
    deadlineStatus = "due_soon_6h";
    const hours = Math.floor(diffHours);
    const mins = Math.floor((diffHours - hours) * 60);
    timeRemainingFormatted = `Due in ${hours}h ${mins}m`;
    deadlineScore = 90;
  } else if (diffHours <= 24) {
    deadlineStatus = "due_today";
    const hours = Math.floor(diffHours);
    timeRemainingFormatted = `Due today in ~${hours}h`;
    deadlineScore = 60;
  } else if (diffHours <= 72) {
    deadlineStatus = "due_soon_3d";
    const days = Math.floor(diffHours / 24);
    timeRemainingFormatted = `Due in ${days} days`;
    deadlineScore = 35;
  } else if (diffHours <= 168) {
    deadlineStatus = "due_this_week";
    const days = Math.floor(diffHours / 24);
    timeRemainingFormatted = `Due in ${days} days`;
    deadlineScore = 15;
  } else {
    deadlineStatus = "upcoming";
    const days = Math.floor(diffHours / 24);
    timeRemainingFormatted = `Due in ${days} days`;
    deadlineScore = 5;
  }

  // 3. Status Adjustment
  let statusScore = 0;
  if (isCompleted) {
    statusScore = -1000; // Completed tasks drop to bottom
    timeRemainingFormatted = "Resolved / Completed";
  } else if (task.status === "pending") {
    statusScore = 15; // High priority to get picked up
  } else if (task.status === "in_progress") {
    statusScore = 10; // Ongoing momentum
  } else if (task.status === "blocked") {
    statusScore = 5;
  }

  const rawScore = urgencyWeight + deadlineScore + statusScore;
  const finalScore = Math.max(0, rawScore);

  // Determine Priority Tier
  let priorityTier = "P4";
  let priorityLabel = "P4 - Low";
  let tierColor = "gray";

  if (isCompleted) {
    priorityTier = "Done";
    priorityLabel = "Completed";
    tierColor = "emerald";
  } else if (finalScore >= 160) {
    priorityTier = "P1";
    priorityLabel = "P1 - Critical / Urgent";
    tierColor = "rose";
  } else if (finalScore >= 110) {
    priorityTier = "P2";
    priorityLabel = "P2 - High Priority";
    tierColor = "amber";
  } else if (finalScore >= 65) {
    priorityTier = "P3";
    priorityLabel = "P3 - Moderate";
    tierColor = "sky";
  } else {
    priorityTier = "P4";
    priorityLabel = "P4 - Routine";
    tierColor = "slate";
  }

  return {
    ...task,
    priorityScore: finalScore,
    priorityTier,
    priorityLabel,
    tierColor,
    deadlineStatus,
    timeRemainingFormatted,
    scoreBreakdown: {
      urgencyWeight,
      deadlineScore,
      statusScore,
      isOverdue: diffHours < 0 && !isCompleted
    }
  };
}
