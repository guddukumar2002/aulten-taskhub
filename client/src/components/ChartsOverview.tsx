import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { TaskAnalytics } from "../types/task";

interface ChartsOverviewProps {
  analytics: TaskAnalytics | null;
}

const STATUS_COLORS: Record<string, string> = {
  "To Do": "#64748b", // slate
  "In Progress": "#3b82f6", // blue
  Blocked: "#f59e0b", // amber
  Completed: "#10b981" // emerald
};

const PRIORITY_COLORS: Record<string, string> = {
  Urgent: "#ef4444", // red
  High: "#f97316", // orange
  Medium: "#6366f1", // indigo
  Low: "#94a3b8" // slate
};

export const ChartsOverview: React.FC<ChartsOverviewProps> = ({ analytics }) => {
  if (!analytics) return null;

  const statusData = analytics.statusDistribution?.length
    ? analytics.statusDistribution
    : [
        { name: "To Do", value: analytics.toDo || 0, color: STATUS_COLORS["To Do"] },
        { name: "In Progress", value: analytics.inProgress || 0, color: STATUS_COLORS["In Progress"] },
        { name: "Blocked", value: analytics.blocked || 0, color: STATUS_COLORS["Blocked"] },
        { name: "Completed", value: analytics.completed || 0, color: STATUS_COLORS["Completed"] }
      ];

  const priorityData = analytics.priorityDistribution?.length
    ? analytics.priorityDistribution
    : [
        { name: "Urgent", count: analytics.urgent || 0, color: PRIORITY_COLORS["Urgent"] },
        { name: "High", count: 0, color: PRIORITY_COLORS["High"] },
        { name: "Medium", count: 0, color: PRIORITY_COLORS["Medium"] },
        { name: "Low", count: 0, color: PRIORITY_COLORS["Low"] }
      ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {/* Status Distribution Donut */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900">Work Status Breakdown</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Distribution across stages</p>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md shrink-0">
            {analytics.activeTasks} Active
          </span>
        </div>

        <div className="h-48 sm:h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={48}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || entry.color || "#6366f1"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.08)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2 pt-3 border-t border-slate-100 text-[11px] sm:text-xs text-slate-600">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center space-x-1 sm:space-x-1.5">
              <span
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLORS[item.name] || item.color }}
              />
              <span className="font-medium">{item.name}</span>
              <span className="text-slate-400">({item.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Breakdown Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900">Priority Volume</h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Tasks by urgency tier</p>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md shrink-0">
            {analytics.urgent} Critical
          </span>
        </div>

        <div className="h-48 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.08)"
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={PRIORITY_COLORS[entry.name] || entry.color || "#6366f1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2 pt-3 border-t border-slate-100 text-[11px] sm:text-xs text-slate-600">
          {priorityData.map((item) => (
            <div key={item.name} className="flex items-center space-x-1 sm:space-x-1.5">
              <span
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: PRIORITY_COLORS[item.name] || item.color }}
              />
              <span className="font-medium">{item.name}</span>
              <span className="text-slate-400">({item.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
