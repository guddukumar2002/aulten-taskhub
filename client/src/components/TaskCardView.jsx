// client/src/components/TaskCardView.jsx
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
  Tag
} from "lucide-react";

export function TaskCardView({
  tasks = [],
  onOpenSourceApp,
  onViewTaskDetail,
  onUpdateStatus
}) {
  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
        <h3 className="text-base font-semibold text-white">No tasks match your filter criteria</h3>
        <p className="text-xs text-slate-400 mt-1">Try clearing search keywords or selecting different status/employee filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {tasks.map((task) => {
        const isOverdue = task.deadlineStatus === "overdue" && task.status !== "completed";
        const isP1 = task.priorityTier === "P1";

        return (
          <div
            key={task.id}
            className={`bg-slate-900/80 border ${
              isOverdue
                ? "border-rose-500/50 bg-rose-950/10"
                : isP1
                ? "border-amber-500/40 bg-slate-900/90"
                : "border-slate-800 hover:border-slate-700"
            } rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/5`}
          >
            {/* Top Bar: Source System & Priority Tier */}
            <div>
              <div className="flex items-center justify-between mb-3">
                {/* Source Badge */}
                {task.source === "CRM" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Briefcase className="w-3 h-3 mr-1" />
                    Zoho CRM
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <HelpCircle className="w-3 h-3 mr-1" />
                    Helpdesk
                  </span>
                )}

                {/* Priority Badge */}
                <div className="flex items-center space-x-1.5">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] inline-flex items-center space-x-1 ${
                    task.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : isP1
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-urgent-glow"
                      : task.priorityTier === "P2"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : task.priorityTier === "P3"
                      ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}>
                    {isP1 && <Flame className="w-3 h-3 text-rose-400 mr-0.5" />}
                    <span>{task.priorityTier}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {task.priorityScore} pts
                  </span>
                </div>
              </div>

              {/* Task ID & Title */}
              <div className="mb-2">
                <span className="font-mono text-xs font-semibold text-indigo-400 mr-2">
                  {task.id}
                </span>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  task.urgency === "critical"
                    ? "bg-rose-500/15 text-rose-400"
                    : task.urgency === "high"
                    ? "bg-amber-500/15 text-amber-400"
                    : task.urgency === "medium"
                    ? "bg-sky-500/15 text-sky-400"
                    : "bg-slate-800 text-slate-400"
                }`}>
                  {task.urgency}
                </span>
              </div>

              <h4 
                onClick={() => onViewTaskDetail(task)}
                className="text-sm font-semibold text-slate-100 hover:text-indigo-300 cursor-pointer line-clamp-2 transition mb-2"
              >
                {task.title}
              </h4>

              {/* Extra Metadata (Deal Value, Client, Category) */}
              <div className="space-y-1 mb-3 text-xs text-slate-400">
                {task.metadata?.customer && (
                  <div className="flex items-center justify-between">
                    <span>Client:</span>
                    <span className="text-slate-200 font-medium">{task.metadata.customer}</span>
                  </div>
                )}
                {task.metadata?.dealValue && (
                  <div className="flex items-center justify-between">
                    <span>Deal Value:</span>
                    <span className="text-emerald-400 font-mono font-semibold">{task.metadata.dealValue}</span>
                  </div>
                )}
                {task.metadata?.requester && (
                  <div className="flex items-center justify-between">
                    <span>Requester:</span>
                    <span className="text-slate-200 font-medium">{task.metadata.requester}</span>
                  </div>
                )}
                {task.metadata?.category && (
                  <div className="flex items-center justify-between">
                    <span>Category:</span>
                    <span className="text-slate-300">{task.metadata.category}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {task.metadata?.tags && task.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {task.metadata.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section: SLA + Assignee + Actions */}
            <div className="border-t border-slate-800/80 pt-3 mt-2 space-y-3">
              
              {/* Deadline & SLA */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline:</span>
                </span>
                <span className={`font-medium ${
                  isOverdue ? "text-rose-400 font-bold" : "text-slate-200"
                }`}>
                  {task.timeRemainingFormatted}
                </span>
              </div>

              {/* Assignee & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div className="text-xs font-medium text-slate-300">
                    {task.assignedTo.name}
                  </div>
                </div>

                <select
                  value={task.status}
                  onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                  className={`text-xs font-medium rounded-lg px-2 py-1 border focus:outline-none cursor-pointer transition ${
                    task.status === "completed"
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                      : task.status === "in_progress"
                      ? "bg-blue-950/60 text-blue-300 border-blue-800"
                      : task.status === "blocked"
                      ? "bg-amber-950/60 text-amber-300 border-amber-800"
                      : "bg-slate-950 text-slate-300 border-slate-700"
                  }`}
                >
                  <option value="pending" className="bg-slate-900 text-slate-200">Pending</option>
                  <option value="in_progress" className="bg-slate-900 text-slate-200">In Progress</option>
                  <option value="completed" className="bg-slate-900 text-slate-200">Resolved</option>
                  <option value="blocked" className="bg-slate-900 text-slate-200">Blocked</option>
                </select>
              </div>

              {/* Clickable Task Link & Quick View */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => onViewTaskDetail(task)}
                  className="flex-1 py-1.5 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => onOpenSourceApp(task)}
                  className="flex-1 py-1.5 px-3 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 rounded-xl transition flex items-center justify-center space-x-1"
                >
                  <span>Open Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
