// client/src/components/TaskListView.jsx
import React from "react";
import { 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Briefcase, 
  HelpCircle,
  Eye,
  Tag
} from "lucide-react";

export function TaskListView({ 
  tasks = [], 
  onOpenSourceApp, 
  onViewTaskDetail, 
  onUpdateStatus 
}) {
  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No tasks match your filter criteria</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Try clearing search keywords or selecting different status/employee filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Priority / Score</th>
              <th className="py-3.5 px-4">Task Details</th>
              <th className="py-3.5 px-4">Source System</th>
              <th className="py-3.5 px-4">Assignee</th>
              <th className="py-3.5 px-4">Deadline & SLA</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {tasks.map((task) => {
              const isOverdue = task.deadlineStatus === "overdue" && task.status !== "completed";
              const isP1 = task.priorityTier === "P1";

              return (
                <tr 
                  key={task.id}
                  className={`hover:bg-slate-800/40 transition-colors group ${
                    isOverdue ? "bg-rose-950/15" : ""
                  }`}
                >
                  {/* Priority / Score */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
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
                      <span className="text-[11px] font-mono text-slate-400" title="Calculated Priority Score">
                        {task.priorityScore} pts
                      </span>
                    </div>
                  </td>

                  {/* Task Title & Context */}
                  <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                    <div className="flex items-start space-x-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-[11px] text-indigo-400 font-medium">
                            {task.id}
                          </span>
                          <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded ${
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
                        <button
                          onClick={() => onViewTaskDetail(task)}
                          className="font-medium text-slate-200 hover:text-indigo-300 text-left transition leading-snug line-clamp-1 block cursor-pointer"
                        >
                          {task.title}
                        </button>
                        <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                          {task.metadata?.customer && (
                            <span className="text-slate-300 font-medium">
                              Client: {task.metadata.customer}
                            </span>
                          )}
                          {task.metadata?.dealValue && (
                            <span className="text-emerald-400 font-mono font-semibold">
                              {task.metadata.dealValue}
                            </span>
                          )}
                          {task.metadata?.requester && (
                            <span className="text-slate-300 font-medium">
                              Req: {task.metadata.requester}
                            </span>
                          )}
                          {task.metadata?.category && (
                            <span className="text-slate-400">
                              • {task.metadata.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Source System */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      {task.source === "CRM" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Briefcase className="w-3 h-3 mr-1" />
                          Zoho CRM
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <HelpCircle className="w-3 h-3 mr-1" />
                          Helpdesk
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Assignee */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <img
                        src={task.assignedTo.avatar}
                        alt={task.assignedTo.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="font-medium text-slate-200 leading-tight">
                          {task.assignedTo.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {task.assignedTo.role}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Deadline & SLA */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1 font-medium">
                        {isOverdue ? (
                          <span className="text-rose-400 flex items-center space-x-1 font-semibold">
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
                      <span className="text-[10px] text-slate-400 mt-0.5">
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
                  <td className="py-3.5 px-4 whitespace-nowrap">
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
                  </td>

                  {/* Actions: Quick View & Open Source App */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onViewTaskDetail(task)}
                        title="View Details"
                        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenSourceApp(task)}
                        title={`Open in ${task.sourcePlatform}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition shadow-sm"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="w-3 h-3" />
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
  );
}
