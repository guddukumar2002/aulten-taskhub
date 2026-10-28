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
  Calendar,
  Building,
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
      <div className="glass-panel rounded-2xl p-12 text-center my-6">
        <h3 className="text-base font-bold text-white">No tasks match your filter criteria</h3>
        <p className="text-xs text-slate-400 mt-1">Try resetting filters or searching for different keywords.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      {tasks.map((task) => {
        const isOverdue = task.deadlineStatus === "overdue" && task.status !== "completed";
        const isP1 = task.priorityTier === "P1";
        const isCompleted = task.status === "completed";

        return (
          <div
            key={task.id}
            className={`glass-panel-elevated rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${
              isOverdue
                ? "border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-950/30"
                : isP1
                ? "border-amber-500/40 hover:border-amber-500/70"
                : "hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5"
            }`}
          >
            {/* Ambient Corner Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-125 ${
              isOverdue
                ? "bg-rose-500/10"
                : isP1
                ? "bg-amber-500/10"
                : "bg-indigo-500/10"
            }`} />

            {/* Top Bar: Source Badge & Priority Score */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                {/* Source Application */}
                {task.source === "CRM" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25 shadow-sm">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                    Zoho CRM
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-sm">
                    <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                    Helpdesk
                  </span>
                )}

                {/* Priority Tier Badge */}
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-lg font-extrabold text-xs inline-flex items-center space-x-1 shadow-sm ${
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
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {task.priorityScore} pts
                  </span>
                </div>
              </div>

              {/* ID & Urgency Pill */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-mono text-xs font-bold text-indigo-400">
                  {task.id}
                </span>
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                  task.urgency === "critical"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : task.urgency === "high"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : task.urgency === "medium"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                    : "bg-slate-800 text-slate-400"
                }`}>
                  {task.urgency}
                </span>
              </div>

              {/* Title */}
              <h4 
                onClick={() => onViewTaskDetail(task)}
                className="text-sm font-bold text-slate-100 hover:text-indigo-300 cursor-pointer line-clamp-2 transition mb-3 leading-snug"
              >
                {task.title}
              </h4>

              {/* Metadata Box */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/[0.06] space-y-1.5 text-xs text-slate-400 mb-3.5">
                {task.metadata?.customer && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>Account:</span>
                    </span>
                    <span className="text-slate-200 font-bold truncate max-w-[170px]">{task.metadata.customer}</span>
                  </div>
                )}
                {task.metadata?.dealValue && (
                  <div className="flex items-center justify-between">
                    <span>Contract Value:</span>
                    <span className="text-emerald-400 font-mono font-extrabold">{task.metadata.dealValue}</span>
                  </div>
                )}
                {task.metadata?.requester && (
                  <div className="flex items-center justify-between">
                    <span>Requester:</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[170px]">{task.metadata.requester}</span>
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
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {task.metadata.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] font-semibold bg-slate-950/90 px-2 py-0.5 rounded-md text-slate-400 border border-white/[0.08]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section: SLA, Assignee & Actions */}
            <div className="border-t border-white/[0.08] pt-3 mt-1 space-y-3">
              
              {/* SLA & Time Remaining */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>SLA Deadline:</span>
                </span>
                <span className={`font-bold ${
                  isOverdue ? "text-rose-400 urgent-pulse" : "text-amber-400"
                }`}>
                  {task.timeRemainingFormatted}
                </span>
              </div>

              {/* Assignee & Status Changer */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <img
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0"
                  />
                  <div className="text-xs font-bold text-slate-200 truncate">
                    {task.assignedTo.name}
                  </div>
                </div>

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
              </div>

              {/* Action Buttons: Inspect & Open Source */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => onViewTaskDetail(task)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/[0.08] rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Inspect</span>
                </button>
                
                <button
                  onClick={() => onOpenSourceApp(task)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/25 active:scale-95"
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
