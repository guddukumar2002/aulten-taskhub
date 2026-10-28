import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAllTasks } from "../services/api";

describe("API Client Resiliency (Promise.allSettled & Error Handling)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("handles successful multi-source fetch and normalizes tasks", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/crm/tasks")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: [
              {
                id: "CRM-101",
                title: "Client Contract Renewal",
                employeeId: "emp-1",
                employeeName: "Guddu Kumar",
                source: "CRM",
                priority: "High",
                status: "In Progress",
                dueDate: "2026-10-29T10:00:00Z",
                sourceUrl: "https://crm.example.com/deals/101"
              }
            ]
          })
        });
      }
      if (url.includes("/helpdesk/tasks")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: [
              {
                id: "TKT-201",
                title: "SSL Certificate Expiry",
                employeeId: "emp-1",
                employeeName: "Guddu Kumar",
                source: "Helpdesk",
                priority: "Urgent",
                status: "To Do",
                dueDate: "2026-10-28T18:00:00Z",
                sourceUrl: "https://helpdesk.example.com/tickets/201"
              }
            ]
          })
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    }) as any;

    const result = await fetchAllTasks();

    expect(result.isTotalFailure).toBe(false);
    expect(result.isPartialFailure).toBe(false);
    expect(result.tasks.length).toBe(2);
    expect(result.serviceHealth.crm.healthy).toBe(true);
    expect(result.serviceHealth.helpdesk.healthy).toBe(true);
    expect(result.tasks[0].priorityScore).toBeGreaterThan(0);
  });

  it("isolates CRM failure and returns Helpdesk tasks with partial failure flag", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/crm/tasks")) {
        return Promise.resolve({
          ok: false,
          status: 503,
          statusText: "Service Unavailable",
          json: async () => ({ message: "CRM database unavailable" })
        });
      }
      if (url.includes("/helpdesk/tasks")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: [
              {
                id: "TKT-202",
                title: "Database connection pool",
                employeeId: "emp-1",
                employeeName: "Guddu Kumar",
                source: "Helpdesk",
                priority: "Urgent",
                status: "To Do",
                dueDate: "2026-10-28T14:00:00Z",
                sourceUrl: "https://helpdesk.example.com/tickets/202"
              }
            ]
          })
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    }) as any;

    const result = await fetchAllTasks();

    expect(result.isPartialFailure).toBe(true);
    expect(result.isTotalFailure).toBe(false);
    expect(result.serviceHealth.crm.healthy).toBe(false);
    expect(result.serviceHealth.helpdesk.healthy).toBe(true);
    expect(result.tasks.length).toBe(1);
    expect(result.tasks[0].id).toBe("TKT-202");
  });

  it("identifies total failure when both upstream services are down", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error"
      });
    }) as any;

    const result = await fetchAllTasks();

    expect(result.isTotalFailure).toBe(true);
    expect(result.isPartialFailure).toBe(false);
    expect(result.tasks.length).toBe(0);
    expect(result.errorMessage).toBeDefined();
  });

  it("passes simulate_error query parameter to upstream endpoints", async () => {
    const urlsCalled: string[] = [];
    global.fetch = vi.fn().mockImplementation((url: string) => {
      urlsCalled.push(url);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ success: true, data: [] })
      });
    }) as any;

    await fetchAllTasks({}, undefined, "crm");

    expect(urlsCalled.some((u) => u.includes("simulate_error=crm"))).toBe(true);
  });
});
