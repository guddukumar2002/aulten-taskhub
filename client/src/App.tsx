import React, { useState, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { KpiCards } from "./components/KpiCards";
import { ChartsOverview } from "./components/ChartsOverview";
import { NeedsAttention } from "./components/NeedsAttention";
import { FilterToolbar } from "./components/FilterToolbar";
import { TaskTable } from "./components/TaskTable";
import { TaskDrawer } from "./components/TaskDrawer";
import { IntegrationsView } from "./components/IntegrationsView";
import { SettingsView } from "./components/SettingsView";
import {
  fetchAllTasks,
  fetchEmployees,
  fetchAnalytics,
  updateTaskStatus
} from "./services/api";
import {
  Task,
  Employee,
  TaskAnalytics,
  ServiceHealth,
  TaskFilterParams,
  TaskStatus
} from "./types/task";
import { AlertTriangle, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";

export function App() {
  // Navigation & Layout
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Data States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth>({
    crm: { healthy: true, error: null, count: 0 },
    helpdesk: { healthy: true, error: null, count: 0 }
  });

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPartialFailure, setIsPartialFailure] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fault simulation state (crm, helpdesk, both, or null)
  const [simulateError, setSimulateError] = useState<string | null>(null);

  // User & Filter States
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("emp-1"); // Default: Guddu Kumar
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<TaskFilterParams>({
    search: "",
    employeeId: "all",
    status: "all",
    priority: "all",
    source: "all",
    sort: "priority_score",
    page: 1,
    limit: 10
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync TopNav search with filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
  }, [searchQuery]);

  // Load Initial Metadata (Employees & Analytics)
  useEffect(() => {
    async function loadMeta() {
      try {
        const [empData, analyticsData] = await Promise.all([
          fetchEmployees(),
          fetchAnalytics()
        ]);
        setEmployees(empData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        console.error("Metadata load error:", err);
      }
    }
    loadMeta();
  }, []);

  // Primary Data Fetcher
  const loadData = useCallback(
    async (manualRefresh = false) => {
      if (manualRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      setErrorMessage(null);

      try {
        const result = await fetchAllTasks({}, undefined, simulateError);

        setTasks(result.tasks);
        setServiceHealth(result.serviceHealth);
        setIsPartialFailure(result.isPartialFailure);

        if (result.isTotalFailure) {
          setErrorMessage(result.errorMessage || "All upstream task services are currently unreachable.");
        }

        // Also refresh analytics summary
        const analyticsData = await fetchAnalytics();
        setAnalytics(analyticsData);
      } catch (err: any) {
        console.error("loadData error:", err);
        setErrorMessage(err.message || "Failed to communicate with task services.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [simulateError]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Status Update
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (newStatus === "Completed") {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // confetti fallback
      }
    }

    try {
      await updateTaskStatus(taskId, newStatus);
      showToast(`Task ${taskId} moved to ${newStatus}`);
      const refreshedAnalytics = await fetchAnalytics();
      setAnalytics(refreshedAnalytics);
    } catch (err: any) {
      showToast(`Error updating task: ${err.message}`);
      loadData();
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      search: "",
      employeeId: "all",
      status: "all",
      priority: "all",
      source: "all",
      sort: "priority_score",
      page: 1,
      limit: 10
    });
  };

  // Filter tasks based on activeTab and filters
  const displayedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by Tab perspective
    if (activeTab === "my") {
      if (selectedEmployeeId && selectedEmployeeId !== "all") {
        result = result.filter((t) => t.employeeId === selectedEmployeeId);
      }
    } else if (activeTab === "priority") {
      result = result.filter(
        (t) =>
          t.status !== "Completed" &&
          (t.priority === "Urgent" || t.priorityTier === "P1" || t.deadlineStatus === "overdue")
      );
    } else if (activeTab === "completed") {
      result = result.filter((t) => t.status === "Completed");
    }

    // Apply explicit filters
    if (filters.employeeId && filters.employeeId !== "all") {
      result = result.filter((t) => t.employeeId === filters.employeeId);
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((t) => t.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters.priority && filters.priority !== "all") {
      result = result.filter((t) => t.priority.toLowerCase() === filters.priority!.toLowerCase());
    }

    if (filters.source && filters.source !== "all") {
      result = result.filter((t) => t.source.toLowerCase() === filters.source!.toLowerCase());
    }

    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.employeeName.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters.sort === "deadline_asc") {
      result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (filters.sort === "priority_desc") {
      const weights: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => (weights[b.priority] || 0) - (weights[a.priority] || 0));
    } else if (filters.sort === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: Priority Score descending
      result.sort((a, b) => {
        if (b.priorityScore !== a.priorityScore) {
          return b.priorityScore - a.priorityScore;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    return result;
  }, [tasks, activeTab, selectedEmployeeId, filters]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: tasks.length,
      my: tasks.filter((t) => t.employeeId === selectedEmployeeId && t.status !== "Completed").length,
      priority: tasks.filter(
        (t) =>
          t.status !== "Completed" &&
          (t.priority === "Urgent" || t.priorityTier === "P1" || t.deadlineStatus === "overdue")
      ).length,
      completed: tasks.filter((t) => t.status === "Completed").length
    };
  }, [tasks, selectedEmployeeId]);

  const activeEmployeeObj = employees.find((e) => e.id === selectedEmployeeId) || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        counts={tabCounts}
        activeEmployee={activeEmployeeObj}
        serviceHealth={serviceHealth}
      />

      {/* Main Content Layout */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Navigation */}
        <TopNav
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          serviceHealth={serviceHealth}
          isRefreshing={isRefreshing}
          onRefresh={() => loadData(true)}
          tasks={tasks}
          onSelectTask={(task) => setSelectedTask(task)}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Partial Failure Notification Banner */}
          {isPartialFailure && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-xs animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Degraded Service Connection Detected
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {!serviceHealth.crm.healthy
                      ? `CRM Gateway is unreachable (${serviceHealth.crm.error || "503 Service Unavailable"}). Displaying ${serviceHealth.helpdesk.count} Helpdesk records safely.`
                      : `Helpdesk Gateway is unreachable (${serviceHealth.helpdesk.error || "503 Service Unavailable"}). Displaying ${serviceHealth.crm.count} CRM records safely.`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSimulateError(null);
                  loadData(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                Restore Connection
              </button>
            </div>
          )}

          {/* Total Failure Banner */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center shadow-xs">
              <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-rose-900">Gateway Communication Outage</h3>
              <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">{errorMessage}</p>
              <button
                onClick={() => {
                  setSimulateError(null);
                  loadData(true);
                }}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Reconnect & Retry
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading && tasks.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium text-slate-500">
                Synchronizing CRM and Helpdesk feeds...
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <KpiCards
                    analytics={analytics}
                    onFilterClick={(type) => {
                      if (type === "all") setActiveTab("all");
                      else if (type === "completed") setActiveTab("completed");
                      else if (type === "overdue" || type === "due_today") {
                        setActiveTab("all");
                        setFilters((prev) => ({
                          ...prev,
                          status: "all"
                        }));
                      }
                    }}
                  />

                  {/* Immediate Action / Needs Attention Alert */}
                  <NeedsAttention
                    tasks={tasks}
                    onSelectTask={(task) => setSelectedTask(task)}
                  />

                  {/* Charts */}
                  <ChartsOverview analytics={analytics} />

                  {/* Quick Action Preview Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Top Priority Work Backlog
                        </h3>
                        <p className="text-xs text-slate-500">
                          Ranked by deterministic urgency score (Overdue + Deadline Proximity + Severity)
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("all")}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        View All Tasks ({tasks.length}) →
                      </button>
                    </div>

                    <TaskTable
                      tasks={displayedTasks.slice(0, 5)}
                      onSelectTask={(task) => setSelectedTask(task)}
                      onStatusChange={handleStatusChange}
                      selectedTaskId={selectedTask?.id}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2, 3, 4, 5: TASKS LISTINGS */}
              {(activeTab === "all" ||
                activeTab === "my" ||
                activeTab === "priority" ||
                activeTab === "completed") && (
                <div className="space-y-4">
                  <FilterToolbar
                    filters={filters}
                    setFilters={setFilters}
                    employees={employees}
                    totalTasks={tasks.length}
                    filteredCount={displayedTasks.length}
                    onClearFilters={handleClearFilters}
                  />

                  <TaskTable
                    tasks={displayedTasks}
                    onSelectTask={(task) => setSelectedTask(task)}
                    onStatusChange={handleStatusChange}
                    selectedTaskId={selectedTask?.id}
                  />
                </div>
              )}

              {/* TAB 6: INTEGRATIONS */}
              {activeTab === "integrations" && (
                <IntegrationsView
                  serviceHealth={serviceHealth}
                  simulateError={simulateError}
                  setSimulateError={setSimulateError}
                  onRefresh={() => loadData(true)}
                  isRefreshing={isRefreshing}
                />
              )}

              {/* TAB 7: SETTINGS */}
              {activeTab === "settings" && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Slide-out Task Details Drawer */}
      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center space-x-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
