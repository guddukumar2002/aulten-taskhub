// client/src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  ShieldAlert, 
  BookOpen, 
  Users, 
  CheckCircle2,
  Clock
} from "lucide-react";

export function Header({
  serviceHealth,
  employees = [],
  selectedEmployee,
  onSelectEmployee,
  onRefresh,
  isLoading,
  onOpenChaosModal,
  onOpenDocsModal
}) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDegraded = serviceHealth && (!serviceHealth.crm?.healthy || !serviceHealth.helpdesk?.healthy);

  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Aulten <span className="text-indigo-400 font-extrabold">TaskPulse</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Unified Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Multi-Source Aggregation: Zoho CRM • Helpdesk / Jira • Prioritization Engine
              </p>
            </div>
          </div>

          {/* Center Info: Live Clock & System Status */}
          <div className="hidden lg:flex items-center space-x-4 bg-slate-900/60 py-1.5 px-3 rounded-full border border-slate-800">
            <div className="flex items-center text-xs text-slate-300 space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{currentTime}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            {isDegraded ? (
              <div className="flex items-center text-xs text-amber-400 space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-medium">Degraded Mode (Failover Active)</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-emerald-400 space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium">All APIs Operational</span>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Employee Switcher */}
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
              <Users className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <label htmlFor="employee-switcher" className="sr-only">Switch Employee</label>
              <select
                id="employee-switcher"
                value={selectedEmployee}
                onChange={(e) => onSelectEmployee(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-slate-900 text-slate-200">
                  👥 All Employees ({employees.length})
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} className="bg-slate-900 text-slate-200">
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Tasks & Metrics"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition border border-transparent hover:border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            {/* Fault Tolerance / Chaos Demo Button */}
            <button
              onClick={onOpenChaosModal}
              title="Simulate API Downtime & Chaos Engineering"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Resilience Lab</span>
            </button>

            {/* Architecture & Docs Button */}
            <button
              onClick={onOpenDocsModal}
              title="View Architecture & Algorithm Explanation"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-600/30"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Docs & Specs</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
