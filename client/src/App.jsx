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
import { ErrorBanner } from "./components/ErrorBanner";
import { 
  fetchTasks, 
  fetchEmployees, 
  fetchAnalytics, 
  updateTaskStatus
} from "./services/api";
import { Sparkles, CheckCircle2 } from "lucide-react";

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
      const [taskRes, analyticsRes, empRes] = await Promise.all([
        fetchTasks({
          employeeId: selectedEmployee,
          status: selectedStatus,
          source: selectedSource,
          urgency: selectedUrgency,
          search: search,
          sort: selectedSort
        }),
        fetchAnalytics(),
        fetchEmployees()
      ]);

      setTasks(taskRes.tasks || []);
      setServiceHealth(taskRes.serviceHealth || { crm: { healthy: true }, helpdesk: { healthy: true } });
      setAnalytics(analyticsRes);
      setEmployees(empRes || []);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleQuickFilter = ({ status, urgency, source }) => {
    if (status !== undefined) setSelectedStatus(status);
    if (urgency !== undefined) setSelectedUrgency(urgency);
    if (source !== undefined) setSelectedSource(source);
  };

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

  const handleUpdateStatus = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    if (newStatus === "completed") {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }

    try {
      await updateTaskStatus(taskId, newStatus);
      showToast(`Task ${taskId} status updated to ${newStatus}`);
      const newAnalytics = await fetchAnalytics();
      setAnalytics(newAnalytics);
    } catch (err) {
      showToast(`Error updating task: ${err.message}`);
      loadData();
    }
  };

  const currentEmp = employees.find((e) => e.id === selectedEmployee);

  return (
    <div className="ambient-bg min-h-screen text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Header
        serviceHealth={serviceHealth}
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={setSelectedEmployee}
        onRefresh={() => loadData(true)}
        isLoading={isLoading || isRetrying}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* Clean Dashboard Briefing Header */}
        <div className="rounded-3xl glass-panel-elevated p-5 sm:p-7 mb-6 border border-white/[0.08] relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold mb-2">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Unified Task Hub</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {currentEmp ? `Tasks for ${currentEmp.name}` : "Employee Task Dashboard"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Centralized dashboard aggregating tasks from <strong>CRM</strong> and <strong>Helpdesk</strong> with intelligent deadline and urgency prioritization.
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block font-medium">Total Active Tasks</span>
              <span className="text-2xl font-extrabold text-white font-mono">
                {analytics?.total || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Degradation / Error Banner */}
        <ErrorBanner
          serviceHealth={serviceHealth}
          errorMessage={errorMessage}
          onRetry={() => loadData(true)}
          isRetrying={isRetrying}
          onDismiss={() => setErrorMessage(null)}
        />

        {/* Metric Cards */}
        <MetricCards
          analytics={analytics}
          onQuickFilter={handleQuickFilter}
          activeFilter={{ status: selectedStatus, urgency: selectedUrgency }}
        />

        {/* Filter Toolbar */}
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

        {/* Task Views */}
        {isLoading && !tasks.length ? (
          <div className="py-20 text-center glass-panel rounded-2xl my-6">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Loading Tasks...</h3>
            <p className="text-xs text-slate-400 mt-1">
              Fetching and prioritizing tasks from CRM & Helpdesk
            </p>
          </div>
        ) : (
          <>
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
      <footer className="border-t border-white/[0.08] bg-[#090d16]/90 py-5 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="font-semibold text-slate-400">
            TaskPulse • Employee Task Dashboard
          </div>
          <div>
            Built with React & Node.js
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

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center space-x-2 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;
