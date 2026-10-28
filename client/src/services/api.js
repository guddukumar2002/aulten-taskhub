// client/src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchTasks(params = {}) {
  const query = new URLSearchParams();
  if (params.employeeId && params.employeeId !== "all") query.append("employeeId", params.employeeId);
  if (params.status && params.status !== "all") query.append("status", params.status);
  if (params.source && params.source !== "all") query.append("source", params.source);
  if (params.urgency && params.urgency !== "all") query.append("urgency", params.urgency);
  if (params.search && params.search.trim() !== "") query.append("search", params.search.trim());
  if (params.sort) query.append("sort", params.sort);

  const url = `${API_BASE_URL}/tasks${query.toString() ? `?${query.toString()}` : ""}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok && res.status !== 503) {
      throw new Error(data.message || `API error: HTTP ${res.status}`);
    }

    return {
      tasks: data.tasks || [],
      count: data.count || 0,
      totalUnifiedCount: data.totalUnifiedCount || 0,
      serviceHealth: data.serviceHealth || {
        crm: { healthy: true, count: 0 },
        helpdesk: { healthy: true, count: 0 }
      },
      isDegraded: Boolean(
        data.serviceHealth && (!data.serviceHealth.crm.healthy || !data.serviceHealth.helpdesk.healthy)
      ),
      isTotalFailure: !res.ok && res.status === 503
    };
  } catch (error) {
    console.error("fetchTasks failed:", error);
    throw error;
  }
}

export async function fetchEmployees() {
  const res = await fetch(`${API_BASE_URL}/employees`);
  if (!res.ok) throw new Error("Failed to load employee list");
  const data = await res.json();
  return data.employees || [];
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  if (!res.ok) throw new Error("Failed to load analytics");
  const data = await res.json();
  return data;
}

export async function updateTaskStatus(taskId, status) {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Failed to update status for ${taskId}`);
  }
  return await res.json();
}
