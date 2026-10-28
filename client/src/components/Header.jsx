// client/src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { 
  Layers, 
  RefreshCw, 
  ShieldAlert, 
  BookOpen, 
  Users, 
  Clock,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
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
  const currentEmp = employees.find((e) => e.id === selectedEmployee);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090d16]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Product Badge */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-[#090d16]"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-white truncate">
                  Aulten <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">TaskPulse</span>
                </span>
                <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                Unified Orchestration Hub: Zoho CRM • Helpdesk / Jira
              </p>
            </div>
          </div>

          {/* Desktop Center: Live System Status Pill & Time */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-white/[0.08] text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentTime}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            {isDegraded ? (
              <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Failover Active (Degraded)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>All APIs Connected</span>
              </div>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Employee Switcher */}
            <div className="relative">
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
                  className="bg-transparent text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer max-w-[110px] sm:max-w-[150px] truncate"
                >
                  <option value="all" className="bg-[#0f172a] text-slate-200">
                    👥 All Employees ({employees.length})
                  </option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-[#0f172a] text-slate-200">
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Sync Tasks"
              className="p-2 sm:p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] transition active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            {/* Resilience Lab (Desktop) */}
            <button
              onClick={onOpenChaosModal}
              title="Open Chaos & Resilience Simulator"
              className="hidden md:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition hover:shadow-lg hover:shadow-rose-500/10"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Resilience Lab</span>
            </button>

            {/* System Specs (Desktop) */}
            <button
              onClick={onOpenDocsModal}
              title="Architecture & Specs"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/30 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Architecture</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-white/[0.08] sm:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 pt-2 border-t border-white/[0.06] space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs px-2 text-slate-300">
              <span>System Status:</span>
              {isDegraded ? (
                <span className="text-amber-400 font-semibold">Degraded Failover</span>
              ) : (
                <span className="text-emerald-400 font-semibold">Operational (100%)</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChaosModal();
                }}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center justify-center space-x-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Resilience Lab</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDocsModal();
                }}
                className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-indigo-600 text-white flex items-center justify-center space-x-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Architecture</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
