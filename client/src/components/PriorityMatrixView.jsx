// client/src/components/PriorityMatrixView.jsx
import React from "react";
import { 
  Flame, 
  Clock, 
  Target, 
  CheckCircle2, 
  ExternalLink,
  Eye,
  ArrowUpRight
} from "lucide-react";

export function PriorityMatrixView({
  tasks = [],
  onOpenSourceApp,
  onViewTaskDetail,
  onUpdateStatus
}) {
  const p1Tasks = tasks.filter((t) => t.priorityTier === "P1");
  const p2Tasks = tasks.filter((t) => t.priorityTier === "P2");
  const p3Tasks = tasks.filter((t) => t.priorityTier === "P3");
  const p4Tasks = tasks.filter((t) => t.priorityTier === "P4" || t.priorityTier === "Done");

  const quadrants = [
    {
      id: "q1",
      tier: "P1",
      title: "Quadrant 1: Urgent & Critical",
      subtitle: "Execute Immediately • Prevent SLA Breach",
      actionBadge: "DO FIRST",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      borderColor: "border-rose-500/40",
      headerBg: "bg-gradient-to-r from-rose-950/40 to-slate-900/60",
      tasks: p1Tasks,
      icon: Flame
    },
    {
      id: "q2",
      tier: "P2",
      title: "Quadrant 2: High Priority",
      subtitle: "Fast-Track Scheduling • Key Milestones",
      actionBadge: "SCHEDULE",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      borderColor: "border-amber-500/40",
      headerBg: "bg-gradient-to-r from-amber-950/40 to-slate-900/60",
      tasks: p2Tasks,
      icon: Clock
    },
    {
      id: "q3",
      tier: "P3",
      title: "Quadrant 3: Moderate & Routine",
      subtitle: "Operational Velocity • Active Sprints",
      actionBadge: "TRACK",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      borderColor: "border-sky-500/40",
      headerBg: "bg-gradient-to-r from-sky-950/40 to-slate-900/60",
      tasks: p3Tasks,
      icon: Target
    },
    {
      id: "q4",
      tier: "P4",
      title: "Quadrant 4: Low & Resolved",
      subtitle: "Backlog Items & Resolved Archive",
      actionBadge: "ARCHIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      borderColor: "border-slate-800",
      headerBg: "bg-gradient-to-r from-slate-900 to-slate-900/60",
      tasks: p4Tasks,
      icon: CheckCircle2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
      {quadrants.map((quad) => {
        const IconComponent = quad.icon;
        return (
          <div
            key={quad.id}
            className={`glass-panel-elevated border ${quad.borderColor} rounded-2xl overflow-hidden shadow-xl flex flex-col`}
          >
            {/* Quadrant Header */}
            <div className={`p-4 border-b border-white/[0.08] ${quad.headerBg} flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${quad.badgeColor} border shadow-sm`}>
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-extrabold text-white tracking-wide">
                      {quad.title}
                    </h4>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 border border-white/[0.1]">
                      {quad.actionBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {quad.subtitle}
                  </p>
                </div>
              </div>
              
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 text-slate-200 border border-white/[0.1]">
                {quad.tasks.length}
              </span>
            </div>

            {/* Tasks inside quadrant */}
            <div className="p-3 divide-y divide-white/[0.05] max-h-[380px] overflow-y-auto space-y-2">
              {quad.tasks.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 italic">
                  No active tasks in this quadrant.
                </div>
              ) : (
                quad.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="pt-2.5 pb-2 hover:bg-slate-800/40 rounded-xl px-3 transition group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-xs font-bold text-indigo-400">
                            {task.id}
                          </span>
                          {task.source === "CRM" ? (
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.2 rounded-full border border-blue-500/25">
                              CRM
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.2 rounded-full border border-purple-500/25">
                              Helpdesk
                            </span>
                          )}
                        </div>

                        <h5
                          onClick={() => onViewTaskDetail(task)}
                          className="text-xs sm:text-sm font-bold text-slate-200 hover:text-indigo-300 cursor-pointer line-clamp-1"
                        >
                          {task.title}
                        </h5>

                        <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">👤 {task.assignedTo.name}</span>
                          <span>•</span>
                          <span className={task.deadlineStatus === "overdue" && task.status !== "completed" ? "text-rose-400 font-extrabold" : "text-amber-400 font-semibold"}>
                            {task.timeRemainingFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button
                          onClick={() => onViewTaskDetail(task)}
                          title="Inspect Metadata"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenSourceApp(task)}
                          title={`Open ${task.sourcePlatform}`}
                          className="p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg transition shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
