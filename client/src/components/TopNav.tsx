import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  RefreshCw,
  ChevronDown,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Employee, Task, ServiceHealth } from "../types/task";

interface TopNavProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  employees: Employee[];
  selectedEmployeeId: string;
  setSelectedEmployeeId: (id: string) => void;
  serviceHealth: ServiceHealth;
  isRefreshing: boolean;
  onRefresh: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenMobileSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  employees,
  selectedEmployeeId,
  setSelectedEmployeeId,
  serviceHealth,
  isRefreshing,
  onRefresh,
  tasks,
  onSelectTask,
  onOpenMobileSidebar
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId);

  // Urgent and Overdue items for notifications
  const urgentOrOverdue = tasks.filter(
    (t) => t.status !== "Completed" && (t.deadlineStatus === "overdue" || t.priority === "Urgent")
  );

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Executive Overview";
      case "all":
        return "All Unified Tasks";
      case "my":
        return `Tasks for ${currentEmployee?.name || "Selected Employee"}`;
      case "priority":
        return "High Priority Backlog";
      case "completed":
        return "Completed Work Archive";
      case "integrations":
        return "Service Connectors & Health";
      case "settings":
        return "System Settings & Scoring";
      default:
        return "Dashboard";
    }
  };

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date());

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-3 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center space-x-2 min-w-0 flex-1 sm:flex-initial">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg -ml-1 transition-colors shrink-0"
          title="Open navigation menu"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-slate-500 truncate">
          <span className="font-semibold text-slate-800 shrink-0">Aulten TaskHub</span>
          <span className="text-slate-300 shrink-0">/</span>
          <span className="text-indigo-600 font-medium truncate">{getBreadcrumbTitle()}</span>
          <span className="hidden xl:inline text-xs text-slate-400 ml-2 font-mono shrink-0">
            ({todayFormatted})
          </span>
        </div>
      </div>

      {/* Middle: Quick Search (Desktop) */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm xl:max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Quick search by title, ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Connection status pills (Large screens only) */}
        <div className="hidden xl:flex items-center space-x-2 text-xs">
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
              serviceHealth.crm.healthy
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
            }`}
            title={serviceHealth.crm.healthy ? "CRM API Online" : serviceHealth.crm.error || "CRM Offline"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                serviceHealth.crm.healthy ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span className="font-medium">CRM</span>
          </div>

          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${
              serviceHealth.helpdesk.healthy
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
            }`}
            title={
              serviceHealth.helpdesk.healthy
                ? "Helpdesk API Online"
                : serviceHealth.helpdesk.error || "Helpdesk Offline"
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                serviceHealth.helpdesk.healthy ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span className="font-medium">Helpdesk</span>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60 relative"
          title="Refresh task data"
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60 relative"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {urgentOrOverdue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {urgentOrOverdue.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Needs Attention ({urgentOrOverdue.length})
                </span>
                <span className="text-[11px] text-slate-400">Live Triggers</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {urgentOrOverdue.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                    All tasks on track. No urgent or overdue items!
                  </div>
                ) : (
                  urgentOrOverdue.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        onSelectTask(task);
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {task.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                            task.deadlineStatus === "overdue"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {task.deadlineStatus === "overdue" ? "Overdue" : "Urgent"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span className="truncate">{task.employeeName}</span>
                        <span className="font-mono text-slate-400 ml-2">{task.id}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Employee Switcher Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-1.5 sm:space-x-2 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-xs font-medium text-slate-700 shadow-2xs"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-[10px] shrink-0">
              {currentEmployee
                ? currentEmployee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                : "ALL"}
            </div>
            <span className="font-semibold text-slate-800 hidden sm:inline max-w-[100px] md:max-w-[120px] truncate">
              {currentEmployee ? currentEmployee.name : "All Assignees"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Switch Perspective
              </div>

              <button
                onClick={() => {
                  setSelectedEmployeeId("all");
                  setShowUserMenu(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                  selectedEmployeeId === "all" ? "bg-indigo-50/70 text-indigo-700 font-semibold" : "text-slate-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                    ∞
                  </div>
                  <span>All Employees (Unified)</span>
                </div>
                {selectedEmployeeId === "all" && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
              </button>

              {employees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployeeId(emp.id);
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    selectedEmployeeId === emp.id ? "bg-indigo-50/70 text-indigo-700 font-semibold" : "text-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[9px] shrink-0">
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="truncate">
                      <div className="font-medium truncate">{emp.name}</div>
                      {emp.role && <div className="text-[10px] text-slate-400 truncate">{emp.role}</div>}
                    </div>
                  </div>
                  {selectedEmployeeId === emp.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
