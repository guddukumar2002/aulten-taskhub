// client/src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { 
  Layers, 
  RefreshCw, 
  Users, 
  Clock,
  BookOpen
} from "lucide-react";

export function Header({
  serviceHealth,
  employees = [],
  selectedEmployee,
  onSelectEmployee,
  onRefresh,
  isLoading,
  onOpenDocsModal
}) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDegraded = serviceHealth && (!serviceHealth.crm?.healthy || !serviceHealth.helpdesk?.healthy);
  const currentEmp = employees.find((e) => e.id === selectedEmployee);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090d16]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Product Name */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-[#090d16]"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Task<span className="text-indigo-400">Pulse</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Dashboard
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                Centralized Task Hub (CRM & Helpdesk)
              </p>
            </div>
          </div>

          {/* Center Info: Live Time & API Status */}
          <div className="hidden md:flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-white/[0.08] text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentTime}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            {isDegraded ? (
              <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Service Notice</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>APIs Connected</span>
              </div>
            )}
          </div>

          {/* Right Action: Employee Filter, System Docs, Refresh */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Employee Selector */}
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-white/[0.1] rounded-xl px-2.5 sm:px-3 py-1.5 text-xs hover:border-indigo-500/50 transition">
              {currentEmp ? (
                <img
                  src={currentEmp.avatar}
                  alt={currentEmp.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-indigo-400/50"
                />
              ) : (
                <Users className="w-4 h-4 text-indigo-400" />
              )}
              
              <select
                value={selectedEmployee}
                onChange={(e) => onSelectEmployee(e.target.value)}
                className="bg-transparent text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[160px] truncate"
              >
                <option value="all" className="bg-[#0f172a] text-slate-200">
                  All Employees ({employees.length})
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} className="bg-[#0f172a] text-slate-200">
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* System Docs Button */}
            <button
              onClick={onOpenDocsModal}
              title="View Architecture & Pipeline Specs"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/[0.08] transition shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Docs</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Tasks"
              className="p-2 sm:p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] transition active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
