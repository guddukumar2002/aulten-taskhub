import { describe, it, expect } from "vitest";
import { calculatePriority } from "../utils/prioritizer";
import { Task } from "../types/task";

describe("Prioritization Engine (Section 6 Deterministic Scoring)", () => {
  const referenceTime = new Date("2026-10-28T12:00:00Z");

  it("assigns +100 to overdue active tasks", () => {
    const overdueTask: Partial<Task> = {
      id: "TEST-01",
      title: "Overdue Agreement",
      priority: "Low", // +5
      status: "To Do",
      dueDate: "2026-10-26T12:00:00Z" // 48h in the past -> +100
    };

    const result = calculatePriority(overdueTask, referenceTime);
    expect(result.scoreBreakdown?.deadlineScore).toBe(100);
    expect(result.scoreBreakdown?.priorityWeight).toBe(5);
    expect(result.priorityScore).toBe(105);
    expect(result.deadlineStatus).toBe("overdue");
    expect(result.primaryReason).toBe("Overdue");
    expect(result.priorityTier).toBe("P2");
  });

  it("assigns +70 to tasks due today", () => {
    const dueTodayTask: Partial<Task> = {
      id: "TEST-02",
      title: "Deliver EOD Report",
      priority: "Medium", // +15
      status: "In Progress",
      dueDate: "2026-10-28T18:00:00Z" // Same day -> +70
    };

    const result = calculatePriority(dueTodayTask, referenceTime);
    expect(result.scoreBreakdown?.deadlineScore).toBe(70);
    expect(result.scoreBreakdown?.priorityWeight).toBe(15);
    expect(result.priorityScore).toBe(85);
    expect(result.deadlineStatus).toBe("due_today");
    expect(result.primaryReason).toBe("Due today");
  });

  it("assigns +50 for Urgent priority and calculates correct cumulative score", () => {
    const urgentTodayTask: Partial<Task> = {
      id: "TEST-03",
      title: "Critical Database Connection Pool Exhausted",
      priority: "Urgent", // +50
      status: "In Progress",
      dueDate: "2026-10-28T16:00:00Z" // Due today -> +70
    };

    const result = calculatePriority(urgentTodayTask, referenceTime);
    expect(result.scoreBreakdown?.priorityWeight).toBe(50);
    expect(result.scoreBreakdown?.deadlineScore).toBe(70);
    expect(result.priorityScore).toBe(120); // 50 + 70 = 120 -> P1 Tier!
    expect(result.priorityTier).toBe("P1");
  });

  it("demotes completed tasks with -1000 status modifier and floor of 0", () => {
    const completedTask: Partial<Task> = {
      id: "TEST-04",
      title: "Completed Server Upgrade",
      priority: "Urgent", // +50
      status: "Completed", // -1000
      dueDate: "2026-10-20T12:00:00Z" // was overdue
    };

    const result = calculatePriority(completedTask, referenceTime);
    expect(result.scoreBreakdown?.statusScore).toBe(-1000);
    expect(result.priorityScore).toBe(0);
    expect(result.priorityTier).toBe("Done");
    expect(result.primaryReason).toBe("Resolved");
  });

  it("adds +10 for blocked tasks", () => {
    const blockedTask: Partial<Task> = {
      id: "TEST-05",
      title: "Waiting on client credentials",
      priority: "High", // +30
      status: "Blocked", // +10
      dueDate: "2026-11-05T12:00:00Z" // > 7 days -> +5
    };

    const result = calculatePriority(blockedTask, referenceTime);
    expect(result.scoreBreakdown?.statusScore).toBe(10);
    expect(result.scoreBreakdown?.priorityWeight).toBe(30);
    expect(result.priorityScore).toBe(45); // 30 + 5 + 10
  });

  it("sorts mixed tasks correctly by score descending and earliest deadline for ties", () => {
    const taskList: Partial<Task>[] = [
      {
        id: "T1",
        title: "Medium task due next week",
        priority: "Medium",
        status: "To Do",
        dueDate: "2026-11-04T12:00:00Z" // 15 + 20 = 35
      },
      {
        id: "T2",
        title: "Urgent overdue task",
        priority: "Urgent",
        status: "To Do",
        dueDate: "2026-10-27T12:00:00Z" // 50 + 100 = 150
      },
      {
        id: "T3",
        title: "Completed task",
        priority: "Urgent",
        status: "Completed",
        dueDate: "2026-10-25T12:00:00Z" // Score: 0
      },
      {
        id: "T4",
        title: "High priority due today",
        priority: "High",
        status: "In Progress",
        dueDate: "2026-10-28T17:00:00Z" // 30 + 70 = 100
      }
    ];

    const evaluated = taskList.map((t) => calculatePriority(t, referenceTime));
    evaluated.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    expect(evaluated[0].id).toBe("T2"); // Score 150
    expect(evaluated[1].id).toBe("T4"); // Score 100
    expect(evaluated[2].id).toBe("T1"); // Score 35
    expect(evaluated[3].id).toBe("T3"); // Score 0
  });
});
