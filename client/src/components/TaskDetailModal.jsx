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
  FileText,
  Calculator,
  UserCheck
} from "lucide-react";

export function TaskDetailModal({ 
  task, 
  onClose, 
  onOpenSourceApp, 
  onUpdateStatus 
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!task) return null;

  const isOverdue = task.deadlineStatus === "overdue" && task.status !== "completed";
  const breakdown = task.scoreBreakdown || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-sm font-bold text-indigo-400">
              {task.id}
            </span>
            <span className="text-slate-600">•</span>
            {task.source === "CRM" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                CRM
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
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
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/[0.08] bg-slate-950/60 px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Task Overview
          </button>
          <button
            onClick={() => setActiveTab("priority")}
            className={`py-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === "priority"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Priority Calculation</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2 text-slate-400">
                  <span>Source: {task.sourcePlatform}</span>
                  <span>•</span>
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Assignee & Status */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/70 rounded-xl border border-white/[0.08]">
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
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Resolved</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Deadline & SLA */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isOverdue
                  ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
                  : "bg-slate-950/70 border-white/[0.08] text-slate-300"
              }`}>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold">Deadline: {task.timeRemainingFormatted}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                  </div>
                </div>
                {isOverdue && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-300">
                    Overdue
                  </span>
                )}
              </div>

              {/* Context & Metadata */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-white/[0.08] space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Details
                </span>
                {task.metadata?.customer && (
                  <div className="flex justify-between border-b border-white/[0.05] pb-1">
                    <span className="text-slate-400">Customer Account:</span>
                    <span className="font-semibold text-slate-200">{task.metadata.customer}</span>
                  </div>
                )}
                {task.metadata?.dealValue && (
                  <div className="flex justify-between border-b border-white/[0.05] pb-1">
                    <span className="text-slate-400">Deal Value:</span>
                    <span className="font-mono font-bold text-emerald-400">{task.metadata.dealValue}</span>
                  </div>
                )}
                {task.metadata?.requester && (
                  <div className="flex justify-between border-b border-white/[0.05] pb-1">
                    <span className="text-slate-400">Requester:</span>
                    <span className="font-semibold text-slate-200">{task.metadata.requester}</span>
                  </div>
                )}
                {task.metadata?.category && (
                  <div className="flex justify-between border-b border-white/[0.05] pb-1">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-slate-200">{task.metadata.category}</span>
                  </div>
                )}
                {task.metadata?.notes && (
                  <div className="pt-1 text-slate-300 leading-relaxed">
                    <span className="text-slate-400 block mb-0.5">Notes:</span>
                    {task.metadata.notes}
                  </div>
                )}
                {task.metadata?.description && (
                  <div className="pt-1 text-slate-300 leading-relaxed font-mono">
                    <span className="text-slate-400 block mb-0.5">Description:</span>
                    {task.metadata.description}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "priority" && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/[0.08] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Base Urgency ({task.urgency}):</span>
                  <span className="font-mono font-bold text-amber-400">+{breakdown.urgencyWeight || 0} pts</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Deadline Factor ({task.deadlineStatus}):</span>
                  <span className="font-mono font-bold text-rose-400">+{breakdown.deadlineScore || 0} pts</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Status Weight ({task.status}):</span>
                  <span className="font-mono font-bold text-indigo-400">
                    {breakdown.statusScore >= 0 ? `+${breakdown.statusScore}` : breakdown.statusScore} pts
                  </span>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Calculated Priority Score:</span>
                  <span className="font-mono text-indigo-400 text-base">{task.priorityScore} pts</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-xl border border-white/[0.08] text-[11px] text-slate-400">
                Prioritization Tier: <strong className="text-white">{task.priorityLabel}</strong> ({task.priorityTier}). Tasks with approaching deadlines and higher urgency automatically float to the top of the queue.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
          >
            Close
          </button>
          
          <button
            onClick={() => onOpenSourceApp(task)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
          >
            <span>Open in Source Application</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
