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
import { Sparkles, CheckCircle2, ShieldAlert, BookOpen, Layers } from "lucide-react";

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

  // Filters & Controls (Default view: Cards or Table)
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
          particleCount: 100,
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
        onOpenChaosModal={() => setIsChaosOpen(true)}
        onOpenDocsModal={() => setIsDocsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        
        {/* Hero Welcome & Briefing Banner */}
        <div className="relative overflow-hidden rounded-3xl glass-panel-elevated p-5 sm:p-7 mb-6 border border-white/[0.1] bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Operations Dashboard</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {currentEmp ? `Workspace for ${currentEmp.name}` : "Unified Enterprise Task Center"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Aggregating real-time tasks from <strong>Zoho CRM</strong> deals and <strong>Helpdesk / Jira</strong> incident tickets with dynamic prioritization algorithms.
              </p>
            </div>

            <div className="flex items-center space-x-2 self-start md:self-auto">
              <button
                onClick={() => setIsDocsOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/[0.1] transition flex items-center space-x-1.5 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>View System Design</span>
              </button>

              <button
                onClick={() => setIsChaosOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition flex items-center space-x-1.5 shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Resilience Lab</span>
              </button>
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

        {/* Executive KPI Metric Cards */}
        <MetricCards
          analytics={analytics}
          onQuickFilter={handleQuickFilter}
          activeFilter={{ status: selectedStatus, urgency: selectedUrgency }}
        />

        {/* Filter and View Switching Command Center */}
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

        {/* Loading State or Views */}
        {isLoading && !tasks.length ? (
          <div className="py-24 text-center glass-panel rounded-2xl my-6">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-sm font-bold text-white">Aggregating & Normalizing REST APIs...</h3>
            <p className="text-xs text-slate-400 mt-1">
              Synchronizing Zoho CRM and Helpdesk tickets with mathematical prioritization
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
      <footer className="border-t border-white/[0.08] bg-[#090d16]/90 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">Aulten TaskPulse</span>
            <span>•</span>
            <span>Practical Hiring Assignment for Aulten Digital Private Limited</span>
          </div>
          <div>
            Engineered by <strong className="text-indigo-400">Guddu Kumar</strong> (Full Stack Developer)
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

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-2 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;
