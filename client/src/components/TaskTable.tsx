import React, { useState } from "react";
import {
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowRight
} from "lucide-react";
import { Task, TaskPriority, TaskStatus, PriorityTier } from "../types/task";

interface TaskTableProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  selectedTaskId?: string;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onSelectTask,
  onStatusChange,
  selectedTaskId
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(tasks.length / pageSize) || 1;
  const paginatedTasks = tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "Urgent":
        return "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      case "High":
        return "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
      case "Medium":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Low":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Blocked":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "To Do":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getTierBadge = (tier: PriorityTier) => {
    switch (tier) {
      case "P1":
        return "bg-rose-600 text-white";
      case "P2":
        return "bg-orange-500 text-white";
      case "P3":
        return "bg-indigo-600 text-white";
      case "Done":
        return "bg-emerald-600 text-white";
      case "P4":
      default:
        return "bg-slate-400 text-white";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Task & Reason</th>
              <th className="py-3 px-3">Assignee</th>
              <th className="py-3 px-3">Source</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Deadline</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No tasks match your criteria</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Adjust your search or clear filters to view more items.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTasks.map((task) => {
                const isSelected = selectedTaskId === task.id;
                return (
                  <tr
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className={`group hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? "bg-indigo-50/50" : ""
                    } ${task.status === "Completed" ? "opacity-75 bg-slate-50/30" : ""}`}
                  >
                    {/* Task Title & Details */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getTierBadge(
                            task.priorityTier
                          )}`}
                          title={`Deterministic Score: ${task.priorityScore}`}
                        >
                          {task.priorityTier}
                        </span>
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-mono text-[10px] text-slate-400">{task.id}</span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                            task.deadlineStatus === "overdue" && task.status !== "Completed"
                              ? "text-rose-600 bg-rose-50 font-semibold"
                              : task.deadlineStatus === "due_today" && task.status !== "Completed"
                              ? "text-amber-700 bg-amber-50 font-semibold"
                              : "text-slate-500"
                          }`}
                        >
                          {task.primaryReason}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (Score: {task.priorityScore})
                        </span>
                      </div>
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-[10px] border border-slate-200">
                          {task.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <span className="text-slate-700 font-medium">{task.employeeName}</span>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded border font-medium ${
                          task.source === "CRM"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {task.source}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded border ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td
                      className="py-3 px-3 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                        className={`text-[11px] rounded border px-2 py-0.5 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${getStatusBadge(
                          task.status
                        )}`}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Blocked">Blocked</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Deadline */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span
                          className={`font-medium ${
                            task.deadlineStatus === "overdue" && task.status !== "Completed"
                              ? "text-rose-600 font-semibold"
                              : task.deadlineStatus === "due_today" && task.status !== "Completed"
                              ? "text-amber-700 font-semibold"
                              : "text-slate-600"
                          }`}
                        >
                          {task.timeRemainingFormatted}
                        </span>
                        <span className="text-[10px] text-slate-400">{formatDate(task.dueDate)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectTask(task)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          title="View task detail drawer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={task.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors inline-flex items-center"
                          title={`Open directly in ${task.source} portal`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack View (sm:hidden) */}
      <div className="md:hidden divide-y divide-slate-100">
        {paginatedTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">No tasks found</p>
          </div>
        ) : (
          paginatedTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="p-4 space-y-2.5 active:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getTierBadge(
                      task.priorityTier
                    )}`}
                  >
                    {task.priorityTier}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      task.source === "CRM"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}
                  >
                    {task.source}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{task.id}</span>
                </div>

                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getPriorityBadge(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-900 leading-snug">{task.title}</h4>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Assignee: {task.employeeName}</span>
                <span
                  className={`font-semibold ${
                    task.deadlineStatus === "overdue" && task.status !== "Completed"
                      ? "text-rose-600"
                      : "text-slate-600"
                  }`}
                >
                  {task.timeRemainingFormatted}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <select
                  value={task.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                  className={`text-xs rounded border px-2 py-1 font-medium ${getStatusBadge(
                    task.status
                  )}`}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>

                <a
                  href={task.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded"
                >
                  Open Source <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/75 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="text-slate-400">·</span>
          <span>
            Page <strong className="text-slate-800">{currentPage}</strong> of{" "}
            <strong className="text-slate-800">{totalPages}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
