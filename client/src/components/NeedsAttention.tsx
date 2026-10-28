import React from "react";
import { AlertTriangle, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { Task } from "../types/task";

interface NeedsAttentionProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const NeedsAttention: React.FC<NeedsAttentionProps> = ({ tasks, onSelectTask }) => {
  // Overdue and active tasks, or urgent tasks due within 48 hours
  const criticalTasks = tasks
    .filter(
      (t) =>
        t.status !== "Completed" &&
        (t.deadlineStatus === "overdue" || t.priority === "Urgent" || t.deadlineStatus === "due_today")
    )
    .slice(0, 4);

  if (criticalTasks.length === 0) return null;

  return (
    <div className="bg-white border border-rose-200/80 rounded-xl p-3.5 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-100 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-rose-100 text-rose-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900">Immediate Action Required</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {criticalTasks.length} work items are overdue or critical priority
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
          Triage Priority
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {criticalTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onSelectTask(task)}
            className="group p-3 sm:p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/50 hover:bg-white cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded ${
                    task.source === "CRM"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-purple-50 text-purple-700 border border-purple-200"
                  }`}
                >
                  {task.source} · {task.id}
                </span>

                <span
                  className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded ${
                    task.deadlineStatus === "overdue"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {task.timeRemainingFormatted}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {task.title}
              </h4>
            </div>

            <div className="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate mr-2">{task.employeeName}</span>
              <span className="flex items-center text-indigo-600 font-medium group-hover:translate-x-0.5 transition-transform shrink-0">
                View <ArrowRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
