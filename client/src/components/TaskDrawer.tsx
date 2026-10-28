import React, { useEffect } from "react";
import {
  X,
  ExternalLink,
  Calendar,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  Tag
} from "lucide-react";
import { Task, TaskStatus } from "../types/task";

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  onClose,
  onStatusChange
}) => {
  // ESC key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!task) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short"
    }).format(d);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2.5">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                  task.source === "CRM"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-purple-50 text-purple-700 border-purple-200"
                }`}
              >
                {task.source} Portal
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">{task.id}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close drawer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{task.title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                {task.description || "No extended description provided for this work item."}
              </p>
            </div>

            {/* Quick Status Action */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Update Task Lifecycle
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["To Do", "In Progress", "Blocked", "Completed"] as TaskStatus[]).map((status) => {
                  const isActive = task.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => onStatusChange(task.id, status)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? status === "Completed"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : status === "Blocked"
                            ? "bg-amber-600 text-white shadow-xs"
                            : status === "In Progress"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-indigo-600 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deterministic Prioritization Score Card */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                  Prioritization Engine
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-indigo-600 text-white rounded">
                  Score: {task.priorityScore} · {task.priorityTier}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-indigo-100">
                  <div className="text-slate-400 text-[10px]">Priority Weight</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    +{task.scoreBreakdown?.priorityWeight ?? (task.priority === "Urgent" ? 50 : 30)}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{task.priority}</div>
                </div>

                <div className="bg-white p-2 rounded-lg border border-indigo-100">
                  <div className="text-slate-400 text-[10px]">Deadline Proximity</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    +{task.scoreBreakdown?.deadlineScore ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{task.primaryReason}</div>
                </div>

                <div className="bg-white p-2 rounded-lg border border-indigo-100">
                  <div className="text-slate-400 text-[10px]">Status Weight</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {task.scoreBreakdown?.statusScore ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{task.status}</div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Task Parameters
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block mb-1">Assignee</span>
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{task.employeeName}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block mb-1">Due Date</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>

                {task.metadata?.dealValue && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block mb-1">Commercial Value</span>
                    <div className="flex items-center space-x-1 font-semibold text-emerald-700">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{task.metadata.dealValue}</span>
                    </div>
                  </div>
                )}

                {task.metadata?.customer && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block mb-1">Client Account</span>
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                      <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{task.metadata.customer}</span>
                    </div>
                  </div>
                )}

                {task.metadata?.category && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block mb-1">Support Category</span>
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{task.metadata.category}</span>
                    </div>
                  </div>
                )}

                {task.metadata?.stage && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-slate-400 block mb-1">Pipeline Stage</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {task.metadata.stage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Source: {task.source}</span>
            <a
              href={task.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Open in {task.source} Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
