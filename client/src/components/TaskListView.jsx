// client/src/components/TaskListView.jsx
import React from "react";
import { 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  Briefcase, 
  HelpCircle,
  Eye,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles
} from "lucide-react";

export function TaskListView({ 
  tasks = [], 
  onOpenSourceApp, 
  onViewTaskDetail, 
  onUpdateStatus 
}) {
  if (tasks.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center my-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 mb-3 shadow-lg shadow-indigo-500/10">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">No tasks match your filter criteria</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Try clearing your search query or selecting a different status/employee filter from the bar above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* 1. Desktop & Laptop View: Polished Enterprise Table */}
      <div className="hidden md:block glass-panel-elevated rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-white/[0.08] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-4">Priority & Score</th>
                <th className="py-4 px-4">Task Details & Customer</th>
                <th className="py-4 px-4">System</th>
                <th className="py-4 px-4">Assignee</th>
                <th className="py-4 px-4">Deadline & SLA</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {tasks.map((task) => {
                const isOverdue = task.deadlineStatus === "overdue" && task.status !== "completed";
                const isP1 = task.priorityTier === "P1";
                const isCompleted = task.status === "completed";

                return (
                  <tr 
                    key={task.id}
                    className={`hover:bg-slate-800/40 transition-colors group ${
                      isOverdue ? "bg-rose-950/20" : ""
                    }`}
                  >
                    {/* Priority Tier & Calculated Score */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 rounded-lg font-extrabold text-xs inline-flex items-center space-x-1 shadow-sm ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : isP1
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 urgent-pulse"
                            : task.priorityTier === "P2"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : task.priorityTier === "P3"
                            ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}>
                          {isP1 && <Flame className="w-3.5 h-3.5 text-rose-400 mr-0.5" />}
                          <span>{task.priorityTier}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-bold" title="Smart Priority Score">
                          {task.priorityScore} pts
                        </span>
                      </div>
                    </td>

                    {/* Task Title & Metadata */}
                    <td className="py-4 px-4 max-w-sm lg:max-w-md">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-xs font-bold text-indigo-400">
                            {task.id}
                          </span>
                          <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded ${
                            task.urgency === "critical"
                              ? "bg-rose-500/20 text-rose-300"
                              : task.urgency === "high"
                              ? "bg-amber-500/20 text-amber-300"
                              : task.urgency === "medium"
                              ? "bg-sky-500/20 text-sky-300"
                              : "bg-slate-800 text-slate-400"
                          }`}>
                            {task.urgency}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => onViewTaskDetail(task)}
                          className="font-bold text-slate-100 hover:text-indigo-300 text-left transition leading-snug line-clamp-1 block cursor-pointer"
                        >
                          {task.title}
                        </button>

                        <div className="flex items-center space-x-2.5 mt-1 text-[11px] text-slate-400">
                          {task.metadata?.customer && (
                            <span className="text-slate-300 font-semibold">
                              🏢 {task.metadata.customer}
                            </span>
                          )}
                          {task.metadata?.dealValue && (
                            <span className="text-emerald-400 font-mono font-bold">
                              💰 {task.metadata.dealValue}
                            </span>
                          )}
                          {task.metadata?.requester && (
                            <span className="text-slate-300 font-semibold">
                              👤 {task.metadata.requester}
                            </span>
                          )}
                          {task.metadata?.category && (
                            <span className="text-slate-400">
                              • {task.metadata.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Source System Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {task.source === "CRM" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25">
                          <Briefcase className="w-3.5 h-3.5 mr-1" />
                          Zoho CRM
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/25">
                          <HelpCircle className="w-3.5 h-3.5 mr-1" />
                          Helpdesk
                        </span>
                      )}
                    </td>

                    {/* Assignee */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={task.assignedTo.avatar}
                          alt={task.assignedTo.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                        />
                        <div>
                          <div className="font-bold text-slate-200 leading-tight">
                            {task.assignedTo.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {task.assignedTo.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Deadline & SLA */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1.5 font-bold">
                          {isOverdue ? (
                            <span className="text-rose-400 flex items-center space-x-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              <span>{task.timeRemainingFormatted}</span>
                            </span>
                          ) : task.deadlineStatus === "due_soon_6h" || task.deadlineStatus === "due_today" ? (
                            <span className="text-amber-400 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>{task.timeRemainingFormatted}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300">
                              {task.timeRemainingFormatted}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {new Date(task.deadline).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Interactive Status Changer */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                        className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer transition shadow-sm ${
                          task.status === "completed"
                            ? "bg-emerald-950/70 text-emerald-300 border-emerald-700/60"
                            : task.status === "in_progress"
                            ? "bg-blue-950/70 text-blue-300 border-blue-700/60"
                            : task.status === "blocked"
                            ? "bg-amber-950/70 text-amber-300 border-amber-700/60"
                            : "bg-slate-950 text-slate-300 border-white/[0.1]"
                        }`}
                      >
                        <option value="pending" className="bg-[#0f172a] text-slate-200">🟡 Pending</option>
                        <option value="in_progress" className="bg-[#0f172a] text-slate-200">🔵 In Progress</option>
                        <option value="completed" className="bg-[#0f172a] text-slate-200">🟢 Resolved</option>
                        <option value="blocked" className="bg-[#0f172a] text-slate-200">🟠 Blocked</option>
                      </select>
                    </td>

                    {/* Actions: Inspect & Open Source */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewTaskDetail(task)}
                          title="Inspect Details"
                          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-white/[0.08]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => onOpenSourceApp(task)}
                          title={`Open ${task.sourcePlatform}`}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 rounded-xl transition shadow-sm active:scale-95"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile & Tablet Auto-Collapse View (Prevents bad table overflow) */}
      <div className="md:hidden space-y-3">
        {tasks.map((task) => {
          const isOverdue = task.deadlineStatus === "overdue" && task.status !== "completed";
          const isP1 = task.priorityTier === "P1";

          return (
            <div
              key={task.id}
              className={`glass-panel rounded-2xl p-4 space-y-3 border ${
                isOverdue ? "border-rose-500/40 bg-rose-950/15" : "border-white/[0.08]"
              }`}
            >
              {/* Top Row: Priority Badge + Source Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-lg font-bold text-xs ${
                    isP1 ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 urgent-pulse" : "bg-slate-800 text-slate-300"
                  }`}>
                    {task.priorityTier} ({task.priorityScore} pts)
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    {task.id}
                  </span>
                </div>

                {task.source === "CRM" ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25">
                    Zoho CRM
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/25">
                    Helpdesk
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 
                onClick={() => onViewTaskDetail(task)}
                className="text-sm font-bold text-slate-100 hover:text-indigo-300 cursor-pointer line-clamp-2"
              >
                {task.title}
              </h4>

              {/* Context */}
              <div className="text-xs text-slate-400 space-y-1">
                {task.metadata?.customer && (
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span className="text-slate-200 font-semibold">{task.metadata.customer}</span>
                  </div>
                )}
                {task.metadata?.dealValue && (
                  <div className="flex justify-between">
                    <span>Deal:</span>
                    <span className="text-emerald-400 font-mono font-bold">{task.metadata.dealValue}</span>
                  </div>
                )}
                {task.metadata?.requester && (
                  <div className="flex justify-between">
                    <span>Requester:</span>
                    <span className="text-slate-200 font-semibold">{task.metadata.requester}</span>
                  </div>
                )}
              </div>

              {/* SLA & Assignee */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <img
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-slate-300">{task.assignedTo.name}</span>
                </div>

                <div className={`font-bold ${isOverdue ? "text-rose-400" : "text-amber-400"}`}>
                  {task.timeRemainingFormatted}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/[0.1] text-slate-200 text-xs font-bold rounded-xl px-2.5 py-2 cursor-pointer"
                >
                  <option value="pending">🟡 Pending</option>
                  <option value="in_progress">🔵 In Progress</option>
                  <option value="completed">🟢 Resolved</option>
                  <option value="blocked">🟠 Blocked</option>
                </select>

                <button
                  onClick={() => onOpenSourceApp(task)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition flex items-center space-x-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
