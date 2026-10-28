import React from "react";
import { CheckSquare, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { TaskAnalytics } from "../types/task";

interface KpiCardsProps {
  analytics: TaskAnalytics | null;
  onFilterClick?: (type: "all" | "overdue" | "due_today" | "completed") => void;
  activeFilter?: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  analytics,
  onFilterClick,
  activeFilter
}) => {
  if (!analytics) return null;

  const cards = [
    {
      id: "all",
      label: "Total Work Items",
      value: analytics.total,
      subtitle: `${analytics.sourceBreakdown.crm} CRM · ${analytics.sourceBreakdown.helpdesk} Helpdesk`,
      icon: CheckSquare,
      bg: "bg-white",
      border: "border-slate-200",
      accent: "text-indigo-600 bg-indigo-50",
      textColor: "text-slate-900"
    },
    {
      id: "overdue",
      label: "Overdue Tasks",
      value: analytics.overdue,
      subtitle: analytics.overdue > 0 ? "Requires remediation" : "Zero overdue backlogs",
      icon: AlertCircle,
      bg: analytics.overdue > 0 ? "bg-rose-50/70" : "bg-white",
      border: analytics.overdue > 0 ? "border-rose-200" : "border-slate-200",
      accent: analytics.overdue > 0 ? "text-rose-600 bg-rose-100/70" : "text-slate-400 bg-slate-100",
      textColor: analytics.overdue > 0 ? "text-rose-900" : "text-slate-900"
    },
    {
      id: "due_today",
      label: "Due Today",
      value: analytics.dueToday,
      subtitle: "Targeted EOD",
      icon: Clock,
      bg: analytics.dueToday > 0 ? "bg-amber-50/70" : "bg-white",
      border: analytics.dueToday > 0 ? "border-amber-200" : "border-slate-200",
      accent: analytics.dueToday > 0 ? "text-amber-600 bg-amber-100/70" : "text-slate-400 bg-slate-100",
      textColor: analytics.dueToday > 0 ? "text-amber-900" : "text-slate-900"
    },
    {
      id: "completed",
      label: "Completed Tasks",
      value: analytics.completed,
      subtitle: `${analytics.completionRate}% throughput`,
      icon: CheckCircle2,
      bg: "bg-white",
      border: "border-slate-200",
      accent: "text-emerald-600 bg-emerald-50",
      textColor: "text-slate-900"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id as any)}
            className={`${card.bg} border ${card.border} rounded-xl p-3.5 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-sm cursor-pointer ${
              isSelected ? "ring-2 ring-indigo-500 ring-offset-1" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate mr-1">
                {card.label}
              </span>
              <div className={`p-1.5 sm:p-2 rounded-lg ${card.accent} shrink-0`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="mt-2 sm:mt-3">
              <span className={`text-xl sm:text-2xl font-bold tracking-tight ${card.textColor}`}>
                {card.value}
              </span>
            </div>

            <div className="mt-1 text-[11px] sm:text-xs text-slate-500 truncate font-medium">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
