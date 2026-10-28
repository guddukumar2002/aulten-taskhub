// client/src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Header } from "./components/Header";
import { MetricCards } from "./components/MetricCards";
import { FilterToolbar } from "./components/FilterToolbar";
import { TaskListView } from "./components/TaskListView";
import { TaskCardView } from "./components/TaskCardView";
import { PriorityMatrixView } from "./components/PriorityMatrixView";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { MockSourcePortalModal } from "./components/MockSourcePortalModal";
import { ChaosModal } from "./components/ChaosModal";
import { ArchitectureModal } from "./components/ArchitectureModal";
import { ErrorBanner } from "./components/ErrorBanner";
import { 
  fetchTasks, 
  fetchEmployees, 
  fetchAnalytics, 
  updateTaskStatus,
  getChaosConfig,
  updateChaosConfig,
  resetChaosConfig
} from "./services/api";

export function App() {
  // Data States
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [serviceHealth, setServiceHealth] = useState({
    crm: { healthy: true, count: 0 },
    helpdesk: { healthy: true, count: 0 }
  });

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedSort, setSelectedSort] = useState("smart");
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid" | "matrix"

  // Modal States
  const [detailModalTask, setDetailModalTask] = useState(null);
  const [sourceModalTask, setSourceModalTask] = useState(null);
  const [isChaosOpen, setIsChaosOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [chaosConfig, setChaosConfig] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Tasks with filters
  const loadData = useCallback(async (isRetryAction = false) => {
    if (isRetryAction) setIsRetrying(true);
    else setIsLoading(true);
    setErrorMessage(null);

    try {
      // Parallel fetch for tasks, analytics, employees
      const [taskRes, analyticsRes, empRes, chaosRes] = await Promise.all([
        fetchTasks({
          employeeId: selectedEmployee,
          status: selectedStatus,
          source: selectedSource,
          urgency: selectedUrgency,
          search: search,
          sort: selectedSort
        }),
        fetchAnalytics(),
        fetchEmployees(),
        getChaosConfig().catch(() => null)
      ]);

      setTasks(taskRes.tasks || []);
      setServiceHealth(taskRes.serviceHealth || { crm: { healthy: true }, helpdesk: { healthy: true } });
      setAnalytics(analyticsRes);
      setEmployees(empRes || []);
      if (chaosRes) setChaosConfig(chaosRes);

      if (taskRes.isTotalFailure) {
        setErrorMessage("Both CRM and Helpdesk mock services failed to respond.");
      }
    } catch (err) {
      console.error("loadData error:", err);
      setErrorMessage(err.message || "Failed to communicate with API gateway.");
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [selectedEmployee, selectedStatus, selectedSource, selectedUrgency, search, selectedSort]);

  // Initial fetch and on filter changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Quick Filters from Metric Cards
  const handleQuickFilter = ({ status, urgency, source }) => {
    if (status !== undefined) setSelectedStatus(status);
    if (urgency !== undefined) setSelectedUrgency(urgency);
    if (source !== undefined) setSelectedSource(source);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setSelectedEmployee("all");
    setSelectedStatus("all");
    setSelectedSource("all");
    setSelectedUrgency("all");
    setSelectedSort("smart");
    showToast("Filters reset to default view");
  };

  const hasActiveFilters = 
    Boolean(search) || 
    selectedEmployee !== "all" || 
    selectedStatus !== "all" || 
    selectedSource !== "all" || 
    selectedUrgency !== "all" || 
    selectedSort !== "smart";

  // Handle status update
  const handleUpdateStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    if (newStatus === "completed") {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    }

    try {
      await updateTaskStatus(taskId, newStatus);
      showToast(`Task ${taskId} status updated to ${newStatus}`);
      // Refresh analytics in background
      const newAnalytics = await fetchAnalytics();
      setAnalytics(newAnalytics);
    } catch (err) {
      showToast(`Error updating task: ${err.message}`);
      loadData(); // Revert to server state
    }
  };

  // Chaos handlers
  const handleUpdateChaos = async (partialConfig) => {
    try {
      const updated = await updateChaosConfig(partialConfig);
      setChaosConfig(updated);
      showToast("Chaos simulation parameters applied");
      await loadData();
    } catch (e) {
      showToast(`Failed to update chaos: ${e.message}`);
    }
  };

  const handleResetChaos = async () => {
    try {
      const reset = await resetChaosConfig();
      setChaosConfig(reset);
      showToast("All upstream APIs restored to normal healthy operation");
      await loadData();
    } catch (e) {
      showToast(`Failed to reset chaos: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar Header */}
      <Header
        serviceHealth={serviceHealth}
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={setSelectedEmployee}
        onRefresh={() => loadData(true)}
        isLoading={isLoading || isRetrying}
        onOpenChaosModal={() => setIsChaosOpen(true)}
        onOpenDocsModal={() => setIsDocsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Error / Degradation Alert Banner */}
        <ErrorBanner
          serviceHealth={serviceHealth}
          errorMessage={errorMessage}
          onRetry={() => loadData(true)}
          isRetrying={isRetrying}
          onDismiss={() => setErrorMessage(null)}
        />

        {/* Executive Metric Cards */}
        <MetricCards
          analytics={analytics}
          onQuickFilter={handleQuickFilter}
          activeFilter={{ status: selectedStatus, urgency: selectedUrgency }}
        />

        {/* Filter and View Switching Toolbar */}
        <FilterToolbar
          search={search}
          onSearchChange={setSearch}
          employees={employees}
          selectedEmployee={selectedEmployee}
          onSelectEmployee={setSelectedEmployee}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          selectedUrgency={selectedUrgency}
          onSelectUrgency={setSelectedUrgency}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          totalResults={tasks.length}
        />

        {/* Loading Indicator */}
        {isLoading && !tasks.length ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400 font-medium">
              Aggregating and normalizing tasks from CRM & Helpdesk REST APIs...
            </p>
          </div>
        ) : (
          <>
            {/* View Switching */}
            {viewMode === "list" && (
              <TaskListView
                tasks={tasks}
                onOpenSourceApp={(task) => setSourceModalTask(task)}
                onViewTaskDetail={(task) => setDetailModalTask(task)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {viewMode === "grid" && (
              <TaskCardView
                tasks={tasks}
                onOpenSourceApp={(task) => setSourceModalTask(task)}
                onViewTaskDetail={(task) => setDetailModalTask(task)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {viewMode === "matrix" && (
              <PriorityMatrixView
                tasks={tasks}
                onOpenSourceApp={(task) => setSourceModalTask(task)}
                onViewTaskDetail={(task) => setDetailModalTask(task)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">Aulten TaskPulse</span>
            <span>•</span>
            <span>Full-Stack Assignment for Aulten Digital Private Limited</span>
          </div>
          <div>
            Built with React 19, Node.js Express, and Tailwind CSS by <strong className="text-indigo-400">Guddu Kumar</strong>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {detailModalTask && (
        <TaskDetailModal
          task={detailModalTask}
          onClose={() => setDetailModalTask(null)}
          onOpenSourceApp={(t) => {
            setDetailModalTask(null);
            setSourceModalTask(t);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {sourceModalTask && (
        <MockSourcePortalModal
          task={sourceModalTask}
          onClose={() => setSourceModalTask(null)}
        />
      )}

      {isChaosOpen && (
        <ChaosModal
          chaosConfig={chaosConfig}
          onUpdateChaos={handleUpdateChaos}
          onResetChaos={handleResetChaos}
          onClose={() => setIsChaosOpen(false)}
          serviceHealth={serviceHealth}
        />
      )}

      {isDocsOpen && (
        <ArchitectureModal
          onClose={() => setIsDocsOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;
