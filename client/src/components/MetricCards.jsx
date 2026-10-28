// client/src/components/MetricCards.jsx
import React from "react";
import { 
  AlertCircle, 
  Clock, 
  Layers, 
  Flame, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

export function MetricCards({ analytics, onQuickFilter, activeFilter }) {
  if (!analytics) return null;

  const {
    total = 0,
    completed = 0,
    inProgress = 0,
    pending = 0,
    overdue = 0,
    dueToday = 0,
    critical = 0,
    completionRate = 0,
    sourceBreakdown = { crm: 0, helpdesk: 0 }
  } = analytics;

  const isCriticalActive = activeFilter?.urgency === "critical";
  const isDueTodayActive = activeFilter?.status === "pending";
  const isCompletedActive = activeFilter?.status === "completed";
  const isTotalActive = activeFilter?.urgency === "all" && activeFilter?.status === "all";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-5 sm:my-7">
      
      {/* 1. Total Unified Tasks */}
      <div 
        onClick={() => onQuickFilter({ status: "all", urgency: "all", source: "all" })}
        className={`cursor-pointer glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group ${
          isTotalActive ? "ring-2 ring-indigo-500/80 bg-indigo-950/20" : ""
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/15 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Tasks
          </span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{total}</span>
          <span className="text-[11px] sm:text-xs text-slate-400">across 2 APIs</span>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-1.5 text-[10px] sm:text-[11px]">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/25 font-semibold">
            💼 {sourceBreakdown.crm} CRM
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/25 font-semibold">
            🎧 {sourceBreakdown.helpdesk} Helpdesk
          </span>
        </div>
      </div>

      {/* 2. Critical & Overdue (P1 Urgent Attention) */}
      <div 
        onClick={() => onQuickFilter({ urgency: "critical" })}
        className={`cursor-pointer glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group border-rose-500/30 ${
          isCriticalActive ? "ring-2 ring-rose-500 bg-rose-950/25" : ""
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/20 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>P1 Critical</span>
          </span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-rose-400">{critical}</span>
          {overdue > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-rose-500/25 text-rose-300 border border-rose-500/40 urgent-pulse">
              {overdue} Overdue!
            </span>
          )}
        </div>

        <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">SLA Escalation Risk</span>
          <span className="text-rose-400 font-bold group-hover:translate-x-1 transition-transform flex items-center">
            Filter <ArrowRight className="w-3 h-3 ml-0.5 inline" />
          </span>
        </div>
      </div>

      {/* 3. Due Today / Imminent */}
      <div 
        onClick={() => onQuickFilter({ status: "pending" })}
        className={`cursor-pointer glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group ${
          isDueTodayActive ? "ring-2 ring-amber-500/80 bg-amber-950/20" : ""
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/15 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider">
            Due Today
          </span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{dueToday}</span>
          <span className="text-[11px] sm:text-xs text-amber-300/80 font-medium">&lt;24 hours</span>
        </div>

        <div className="mt-3.5 flex items-center space-x-2 text-[11px] text-slate-400 truncate">
          <span>{pending} pending</span>
          <span>•</span>
          <span>{inProgress} active</span>
        </div>
      </div>

      {/* 4. Resolved / Velocity */}
      <div 
        onClick={() => onQuickFilter({ status: "completed" })}
        className={`cursor-pointer glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group ${
          isCompletedActive ? "ring-2 ring-emerald-500/80 bg-emerald-950/20" : ""
        }`}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Resolution Rate
          </span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-emerald-400">{completionRate}%</span>
          <span className="text-[11px] sm:text-xs text-slate-400">({completed}/{total})</span>
        </div>

        {/* Sleek Progress Track */}
        <div className="mt-3.5 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden ring-1 ring-white/5">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-2 rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/50"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

    </div>
  );
}
