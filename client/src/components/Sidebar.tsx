import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  UserCheck,
  Flame,
  CheckCircle2,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import { Employee } from "../types/task";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  counts: {
    all: number;
    my: number;
    priority: number;
    completed: number;
  };
  activeEmployee: Employee | null;
  serviceHealth: {
    crm: { healthy: boolean };
    helpdesk: { healthy: boolean };
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  counts,
  activeEmployee,
  serviceHealth
}) => {
  const allServicesHealthy = serviceHealth.crm.healthy && serviceHealth.helpdesk.healthy;

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "all", label: "All Tasks", icon: CheckSquare, badge: counts.all },
    { id: "my", label: "My Tasks", icon: UserCheck, badge: counts.my },
    { id: "priority", label: "High Priority", icon: Flame, badge: counts.priority, badgeColor: "rose" },
    { id: "completed", label: "Completed", icon: CheckCircle2, badge: counts.completed },
    { id: "integrations", label: "Integrations", icon: Layers, isHealthy: allServicesHealthy },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out select-none ${
          isMobileOpen
            ? "translate-x-0 shadow-2xl w-64"
            : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-16" : "md:w-64"}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {(!isCollapsed || isMobileOpen) ? (
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h1 className="text-sm font-semibold text-slate-900 tracking-tight leading-none">
                  Aulten TaskHub
                </h1>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide mt-1">
                  Unified Operations
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Desktop Collapse Button */}
          <div className="hidden md:flex items-center">
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2">
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Workspace
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isCompact = isCollapsed && !isMobileOpen;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                title={isCompact ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCompact ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2.5"
                } rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {(!isCompact) && <span className="truncate">{item.label}</span>}
                </div>

                {(!isCompact) && item.badge !== undefined && (
                  <span
                    className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor === "rose"
                        ? "bg-rose-100 text-rose-700"
                        : isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {(!isCompact) && item.isHealthy !== undefined && (
                  <span className="flex h-2 w-2 relative ml-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        item.isHealthy ? "bg-emerald-400" : "bg-rose-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        item.isHealthy ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Expand Button for Collapsed Desktop State */}
        {isCollapsed && (
          <div className="hidden md:flex p-2 border-t border-slate-100 justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active User Footer Profile */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/60">
          {(!isCollapsed || isMobileOpen) ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs shrink-0">
                {activeEmployee
                  ? activeEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "GK"}
              </div>
              <div className="truncate flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {activeEmployee ? activeEmployee.name : "Guddu Kumar"}
                </div>
                <div className="text-[11px] text-slate-500 truncate flex items-center space-x-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Active Context</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs"
                title={activeEmployee ? activeEmployee.name : "Guddu Kumar"}
              >
                {activeEmployee
                  ? activeEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "GK"}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
