// server/src/services/prioritizer.js
/**
 * Deterministic Task Prioritization Engine
 * Based on Section 6 Specification:
 * - Overdue active task: +100
 * - Due today: +70
 * - Due within 24 hours: +60
 * - Due within 3 days: +40
 * - Due within 7 days: +20
 * - Urgent priority: +50
 * - High priority: +30
 * - Medium priority: +15
 * - Low priority: +5
 * - Blocked active task: +10
 * - Completed tasks treated separately (demoted to lowest score)
 */

export function calculatePriority(task, referenceTime = new Date()) {
  const refTime = new Date(referenceTime).getTime();
  const isCompleted = task.status === "Completed";
  const isBlocked = task.status === "Blocked";

  // 1. Priority Weight
  let priorityWeight = 5;
  switch (task.priority) {
    case "Urgent":
      priorityWeight = 50;
      break;
    case "High":
      priorityWeight = 30;
      break;
    case "Medium":
      priorityWeight = 15;
      break;
    case "Low":
    default:
      priorityWeight = 5;
      break;
  }

  // 2. Deadline Proximity Score & Reason
  let deadlineScore = 0;
  let deadlineStatus = "upcoming";
  let timeRemainingFormatted = "No deadline";
  let primaryReason = "Scheduled";

  if (task.dueDate) {
    const deadlineDate = new Date(task.dueDate);
    const deadlineTime = deadlineDate.getTime();

    if (!isNaN(deadlineTime)) {
      const diffHours = (deadlineTime - refTime) / (1000 * 60 * 60);

      const refDateObj = new Date(refTime);
      const isDueCalendarToday =
        deadlineDate.getUTCFullYear() === refDateObj.getUTCFullYear() &&
        deadlineDate.getUTCMonth() === refDateObj.getUTCMonth() &&
        deadlineDate.getUTCDate() === refDateObj.getUTCDate();

      if (diffHours < 0) {
        // Overdue
        deadlineStatus = "overdue";
        const hoursOverdue = Math.abs(diffHours);
        if (hoursOverdue < 24) {
          timeRemainingFormatted = `Overdue by ${Math.floor(hoursOverdue)}h`;
        } else {
          const daysOverdue = Math.floor(hoursOverdue / 24);
          timeRemainingFormatted = `Overdue by ${daysOverdue}d`;
        }

        if (!isCompleted) {
          deadlineScore = 100;
          primaryReason = "Overdue";
        }
      } else if (isDueCalendarToday || diffHours <= 12) {
        deadlineStatus = "due_today";
        const hours = Math.max(1, Math.floor(diffHours));
        timeRemainingFormatted = `Due today (~${hours}h)`;
        deadlineScore = 70;
        primaryReason = "Due today";
      } else if (diffHours <= 24) {
        deadlineStatus = "due_24h";
        const hours = Math.floor(diffHours);
        timeRemainingFormatted = `Due in ${hours}h`;
        deadlineScore = 60;
        primaryReason = "Due in 24h";
      } else if (diffHours <= 72) {
        deadlineStatus = "due_3d";
        const days = Math.floor(diffHours / 24);
        timeRemainingFormatted = `Due in ${days}d`;
        deadlineScore = 40;
        primaryReason = task.priority === "Urgent" ? "Urgent" : "Due in 3d";
      } else if (diffHours <= 168) {
        deadlineStatus = "due_7d";
        const days = Math.floor(diffHours / 24);
        timeRemainingFormatted = `Due in ${days}d`;
        deadlineScore = 20;
        primaryReason = task.priority === "Urgent" ? "Urgent" : task.priority === "High" ? "High Priority" : "Scheduled";
      } else {
        deadlineStatus = "upcoming";
        const days = Math.floor(diffHours / 24);
        timeRemainingFormatted = `Due in ${days}d`;
        deadlineScore = 5;
        primaryReason = task.priority === "Urgent" ? "Urgent" : "Scheduled";
      }
    }
  }

  // 3. Status Weight
  let statusScore = 0;
  if (isCompleted) {
    statusScore = -1000;
    timeRemainingFormatted = "Completed";
    primaryReason = "Resolved";
  } else if (isBlocked) {
    statusScore = 10;
    if (primaryReason === "Scheduled") primaryReason = "Blocked";
  }

  const rawScore = priorityWeight + deadlineScore + statusScore;
  const finalScore = isCompleted ? 0 : Math.max(0, rawScore);

  // Determine Priority Tier
  let priorityTier = "P4";
  if (isCompleted) {
    priorityTier = "Done";
  } else if (finalScore >= 120) {
    priorityTier = "P1";
  } else if (finalScore >= 70) {
    priorityTier = "P2";
  } else if (finalScore >= 35) {
    priorityTier = "P3";
  } else {
    priorityTier = "P4";
  }

  return {
    ...task,
    priorityScore: finalScore,
    priorityTier,
    deadlineStatus,
    timeRemainingFormatted,
    primaryReason,
    scoreBreakdown: {
      priorityWeight,
      deadlineScore,
      statusScore,
      isOverdue: deadlineStatus === "overdue" && !isCompleted
    }
  };
}
