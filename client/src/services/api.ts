// client/src/services/api.ts
import { Task, Employee, TaskAnalytics, ServiceHealth, TaskFilterParams } from "../types/task";
import { calculatePriority } from "../utils/prioritizer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface FetchResult {
  tasks: Task[];
  serviceHealth: ServiceHealth;
  isPartialFailure: boolean;
  isTotalFailure: boolean;
  errorMessage?: string;
}

/**
 * Resilient Multi-Source Task Fetcher using Promise.allSettled
 * Fetches CRM and Helpdesk data concurrently, harmonizing both sources
 */
export async function fetchAllTasks(
  params: TaskFilterParams = {},
  signal?: AbortSignal,
  simulateError?: string | null
): Promise<FetchResult> {
  const query = new URLSearchParams();
  if (simulateError) query.append("simulate_error", simulateError);

  const crmUrl = `${API_BASE_URL}/crm/tasks${query.toString() ? `?${query.toString()}` : ""}`;
  const helpdeskUrl = `${API_BASE_URL}/helpdesk/tasks${query.toString() ? `?${query.toString()}` : ""}`;

  const serviceHealth: ServiceHealth = {
    crm: { healthy: true, error: null, count: 0 },
    helpdesk: { healthy: true, error: null, count: 0 }
  };

  // Concurrent fetching with Promise.allSettled for maximum fault isolation
  const [crmSettled, helpdeskSettled] = await Promise.allSettled([
    fetch(crmUrl, { signal }).then(async (res) => {
      if (!res.ok) throw new Error(`CRM API HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      return json.data || [];
    }),
    fetch(helpdeskUrl, { signal }).then(async (res) => {
      if (!res.ok) throw new Error(`Helpdesk API HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      return json.data || [];
    })
  ]);

  let crmTasks: any[] = [];
  let helpdeskTasks: any[] = [];

  if (crmSettled.status === "fulfilled") {
    crmTasks = crmSettled.value;
    serviceHealth.crm.healthy = true;
    serviceHealth.crm.count = crmTasks.length;
  } else {
    serviceHealth.crm.healthy = false;
    serviceHealth.crm.error = crmSettled.reason?.message || "CRM service unreachable";
  }

  if (helpdeskSettled.status === "fulfilled") {
    helpdeskTasks = helpdeskSettled.value;
    serviceHealth.helpdesk.healthy = true;
    serviceHealth.helpdesk.count = helpdeskTasks.length;
  } else {
    serviceHealth.helpdesk.healthy = false;
    serviceHealth.helpdesk.error = helpdeskSettled.reason?.message || "Helpdesk service unreachable";
  }

  const isTotalFailure = !serviceHealth.crm.healthy && !serviceHealth.helpdesk.healthy;
  const isPartialFailure = (!serviceHealth.crm.healthy && serviceHealth.helpdesk.healthy) ||
                           (serviceHealth.crm.healthy && !serviceHealth.helpdesk.healthy);

  if (isTotalFailure) {
    return {
      tasks: [],
      serviceHealth,
      isPartialFailure: false,
      isTotalFailure: true,
      errorMessage: "Both CRM and Helpdesk services are currently unreachable. Please verify network connectivity."
    };
  }

  // Combine and apply client-side deterministic prioritization
  const rawCombined = [...crmTasks, ...helpdeskTasks];
  const evaluatedTasks = rawCombined.map((t) => calculatePriority(t));

  // Apply filters in memory
  let filtered = evaluatedTasks;

  if (params.employeeId && params.employeeId !== "all") {
    filtered = filtered.filter((t) => t.employeeId === params.employeeId);
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((t) => t.status.toLowerCase() === params.status!.toLowerCase());
  }

  if (params.priority && params.priority !== "all") {
    filtered = filtered.filter((t) => t.priority.toLowerCase() === params.priority!.toLowerCase());
  }

  if (params.source && params.source !== "all") {
    filtered = filtered.filter((t) => t.source.toLowerCase() === params.source!.toLowerCase());
  }

  if (params.search && params.search.trim() !== "") {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (params.sort === "deadline_asc") {
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  } else if (params.sort === "priority_desc") {
    const weights: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    filtered.sort((a, b) => (weights[b.priority] || 0) - (weights[a.priority] || 0));
  } else if (params.sort === "title_asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default: Priority Score Descending, then earliest deadline
    filtered.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  return {
    tasks: filtered,
    serviceHealth,
    isPartialFailure,
    isTotalFailure: false
  };
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE_URL}/employees`);
  if (!res.ok) throw new Error("Failed to load employees");
  const data = await res.json();
  return data.employees || [];
}

export async function fetchAnalytics(): Promise<TaskAnalytics> {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  if (!res.ok) throw new Error("Failed to load analytics");
  const data = await res.json();
  return data;
}

export async function updateTaskStatus(taskId: string, status: string): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to update status for ${taskId}`);
  }
  const json = await res.json();
  return json.task;
}
