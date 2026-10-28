// client/src/components/PriorityMatrixView.jsx
import React from "react";
import { 
  Flame, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Briefcase,
  HelpCircle,
  Eye
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
      subtitle: "Immediate Execution • SLA Escalation",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      borderColor: "border-rose-500/30",
      headerBg: "bg-rose-950/20",
      tasks: p1Tasks,
      icon: Flame
    },
    {
      id: "q2",
      tier: "P2",
      title: "Quadrant 2: High Priority",
      subtitle: "Schedule & Expedite • Key Milestones",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      borderColor: "border-amber-500/30",
      headerBg: "bg-amber-950/20",
      tasks: p2Tasks,
      icon: Clock
    },
    {
      id: "q3",
      tier: "P3",
      title: "Quadrant 3: Moderate & Routine",
      subtitle: "Track Progress • Active Sprints",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      borderColor: "border-sky-500/30",
      headerBg: "bg-sky-950/20",
      tasks: p3Tasks,
      icon: Calendar
    },
    {
      id: "q4",
      tier: "P4",
      title: "Quadrant 4: Low / Completed",
      subtitle: "Backlog Items & Resolved Archive",
      badgeColor: "bg-slate-700 text-slate-300 border-slate-600",
      borderColor: "border-slate-800",
      headerBg: "bg-slate-900/40",
      tasks: p4Tasks,
      icon: CheckCircle2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {quadrants.map((quad) => {
        const IconComponent = quad.icon;
        return (
          <div
            key={quad.id}
            className={`bg-slate-900/80 border ${quad.borderColor} rounded-2xl overflow-hidden shadow-lg flex flex-col`}
          >
            {/* Quadrant Header */}
            <div className={`p-4 border-b border-slate-800 ${quad.headerBg} flex items-center justify-between`}>
              <div className="flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${quad.badgeColor} border`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {quad.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {quad.subtitle}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 text-slate-200 border border-slate-800">
                {quad.tasks.length} items
              </span>
            </div>

            {/* Tasks inside quadrant */}
            <div className="p-3 divide-y divide-slate-800/60 max-h-[360px] overflow-y-auto space-y-2">
              {quad.tasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 italic">
                  No tasks currently in this quadrant.
                </div>
              ) : (
                quad.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="pt-2 pb-1 hover:bg-slate-800/30 rounded-xl px-2.5 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-[11px] text-indigo-400 font-semibold">
                            {task.id}
                          </span>
                          {task.source === "CRM" ? (
                            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20 font-medium">
                              CRM
                            </span>
                          ) : (
                            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20 font-medium">
                              Helpdesk
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            {task.priorityScore} pts
                          </span>
                        </div>
                        <h5
                          onClick={() => onViewTaskDetail(task)}
                          className="text-xs font-medium text-slate-200 hover:text-indigo-300 cursor-pointer line-clamp-1"
                        >
                          {task.title}
                        </h5>
                        <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400">
                          <span>👤 {task.assignedTo.name}</span>
                          <span>•</span>
                          <span className={task.deadlineStatus === "overdue" && task.status !== "completed" ? "text-rose-400 font-semibold" : ""}>
                            {task.timeRemainingFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Right Action: Open in Source App */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onViewTaskDetail(task)}
                          title="Inspect Metadata"
                          className="p-1 text-slate-400 hover:text-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenSourceApp(task)}
                          title={`Open ${task.sourcePlatform}`}
                          className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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
