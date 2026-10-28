// client/src/components/MetricCards.jsx
import React from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  Briefcase, 
  HelpCircle,
  TrendingUp,
  Flame
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      
      {/* 1. Total Unified Tasks */}
      <div 
        onClick={() => onQuickFilter({ status: "all", urgency: "all", source: "all" })}
        className="cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 shadow-md relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/10 rounded-bl-full pointer-events-none transition group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Unified Tasks
          </span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-bold tracking-tight text-white">{total}</span>
          <span className="text-xs text-slate-400">across 2 systems</span>
        </div>
        <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/40">
            💼 {sourceBreakdown.crm} CRM
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
            🎧 {sourceBreakdown.helpdesk} Helpdesk
          </span>
        </div>
      </div>

      {/* 2. Critical & Overdue (P1 Urgent Attention) */}
      <div 
        onClick={() => onQuickFilter({ urgency: "critical" })}
        className={`cursor-pointer bg-slate-900/70 hover:bg-slate-900 border ${
          overdue > 0 ? "border-rose-500/40 hover:border-rose-500" : "border-slate-800 hover:border-slate-700"
        } rounded-xl p-4 transition-all duration-200 shadow-md relative overflow-hidden group`}
      >
        <div className="absolute top-0 right-0 h-16 w-16 bg-rose-500/10 rounded-bl-full pointer-events-none transition group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>P1 Critical & Overdue</span>
          </span>
          <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-bold tracking-tight text-rose-400">{critical}</span>
          {overdue > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              {overdue} Overdue!
            </span>
          )}
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Requires immediate attention</span>
          <span className="text-rose-400 group-hover:underline">Filter P1 &rarr;</span>
        </div>
      </div>

      {/* 3. Due Today / Upcoming */}
      <div 
        onClick={() => onQuickFilter({ status: "pending" })}
        className="cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 shadow-md relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/10 rounded-bl-full pointer-events-none transition group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Due Today / Imminent
          </span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-bold tracking-tight text-white">{dueToday}</span>
          <span className="text-xs text-amber-300/80">within 24 hrs</span>
        </div>
        <div className="mt-3 flex items-center space-x-3 text-[11px] text-slate-400">
          <span>{pending} pending</span>
          <span>•</span>
          <span>{inProgress} in progress</span>
        </div>
      </div>

      {/* 4. Resolved / Velocity */}
      <div 
        onClick={() => onQuickFilter({ status: "completed" })}
        className="cursor-pointer bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 shadow-md relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/10 rounded-bl-full pointer-events-none transition group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Resolution Velocity
          </span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-bold tracking-tight text-emerald-400">{completionRate}%</span>
          <span className="text-xs text-slate-400">({completed}/{total} resolved)</span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

    </div>
  );
}
