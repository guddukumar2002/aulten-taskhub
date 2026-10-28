// client/src/components/TaskDetailModal.jsx
import React, { useState } from "react";
import { 
  X, 
  ExternalLink, 
  Flame, 
  Clock, 
  Briefcase, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Calculator,
  UserCheck
} from "lucide-react";

export function TaskDetailModal({ 
  task, 
  onClose, 
  onOpenSourceApp, 
  onUpdateStatus 
}) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "formula" | "raw"

  if (!task) return null;

  const isOverdue = task.deadlineStatus === "overdue" && task.status !== "completed";
  const breakdown = task.scoreBreakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-sm font-bold text-indigo-400">
              {task.id}
            </span>
            <span className="text-slate-500">•</span>
            {task.source === "CRM" ? (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Zoho CRM
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Helpdesk
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
              task.priorityTier === "P1"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : task.priorityTier === "P2"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
            }`}>
              {task.priorityTier} ({task.priorityScore} pts)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview & Context
          </button>
          <button
            onClick={() => setActiveTab("formula")}
            className={`py-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "formula"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Priority Score Math</span>
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`py-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "raw"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Normalized JSON</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-3 text-slate-400">
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Source Platform: {task.sourcePlatform}</span>
                </div>
              </div>

              {/* Status and Assignee Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Assignee</span>
                  <div className="flex items-center space-x-2">
                    <img
                      src={task.assignedTo.avatar}
                      alt={task.assignedTo.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-slate-200">{task.assignedTo.name}</div>
                      <div className="text-[10px] text-slate-400">{task.assignedTo.role}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Status</span>
                  <select
                    value={task.status}
                    onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Resolved / Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Deadline & SLA */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isOverdue
                  ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
                  : "bg-slate-950/60 border-slate-800 text-slate-300"
              }`}>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold">Deadline: {task.timeRemainingFormatted}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                  </div>
                </div>
                {isOverdue && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-300">
                    SLA Breached
                  </span>
                )}
              </div>

              {/* Extra Metadata */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  System Context & Metadata
                </h4>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                  {Object.entries(task.metadata || {}).map(([k, v]) => {
                    if (k === "tags") return null;
                    return (
                      <div key={k} className="flex justify-between border-b border-slate-800/60 pb-1 last:border-none">
                        <span className="capitalize text-slate-400">{k}:</span>
                        <span className="font-medium text-slate-200 text-right max-w-xs">{String(v)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "formula" && (
            <div className="space-y-4">
              <div className="bg-indigo-950/20 border border-indigo-500/30 p-3.5 rounded-xl text-indigo-300 text-xs">
                <p className="font-semibold mb-1">Intelligent Priority Formula:</p>
                <code className="text-white font-mono block bg-slate-950/80 p-2 rounded border border-indigo-900/50">
                  Priority Score = Urgency Weight + Deadline Proximity Boost + Status Adjustment
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mathematical Breakdown for {task.id}
                </h4>
                
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">1. Base Urgency Weight ({task.urgency}):</span>
                    <span className="font-mono font-bold text-amber-400">+{breakdown.urgencyWeight || 0} pts</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">2. Deadline Factor ({task.deadlineStatus}):</span>
                    <span className="font-mono font-bold text-rose-400">+{breakdown.deadlineScore || 0} pts</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">3. Status Adjustment ({task.status}):</span>
                    <span className="font-mono font-bold text-indigo-400">
                      {breakdown.statusScore >= 0 ? `+${breakdown.statusScore}` : breakdown.statusScore} pts
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                    <span className="text-white">Total Priority Score:</span>
                    <span className="font-mono text-indigo-400 text-base">{task.priorityScore} pts</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  Tier Category: <strong className="text-white">{task.priorityLabel}</strong> ({task.priorityTier}). Overdue and imminent tasks automatically bubble up to P1 to prevent enterprise SLA breaches.
                </div>
              </div>
            </div>
          )}

          {activeTab === "raw" && (
            <div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[300px]">
                {JSON.stringify(task, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
          >
            Close
          </button>
          
          <button
            onClick={() => onOpenSourceApp(task)}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
          >
            <span>Open in Source Application</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
