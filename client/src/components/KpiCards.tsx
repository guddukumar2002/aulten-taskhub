import React from "react";
import { CheckSquare, AlertCircle, Clock, CheckCircle2, TrendingUp } from "lucide-react";
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
      subtitle: analytics.overdue > 0 ? "Requires urgent remediation" : "Zero overdue backlogs",
      icon: AlertCircle,
      bg: analytics.overdue > 0 ? "bg-rose-50/60" : "bg-white",
      border: analytics.overdue > 0 ? "border-rose-200" : "border-slate-200",
      accent: analytics.overdue > 0 ? "text-rose-600 bg-rose-100/70" : "text-slate-400 bg-slate-100",
      textColor: analytics.overdue > 0 ? "text-rose-900" : "text-slate-900"
    },
    {
      id: "due_today",
      label: "Due Today",
      value: analytics.dueToday,
      subtitle: "Targeted for EOD resolution",
      icon: Clock,
      bg: analytics.dueToday > 0 ? "bg-amber-50/60" : "bg-white",
      border: analytics.dueToday > 0 ? "border-amber-200" : "border-slate-200",
      accent: analytics.dueToday > 0 ? "text-amber-600 bg-amber-100/70" : "text-slate-400 bg-slate-100",
      textColor: analytics.dueToday > 0 ? "text-amber-900" : "text-slate-900"
    },
    {
      id: "completed",
      label: "Completed Tasks",
      value: analytics.completed,
      subtitle: `${analytics.completionRate}% throughput rate`,
      icon: CheckCircle2,
      bg: "bg-white",
      border: "border-slate-200",
      accent: "text-emerald-600 bg-emerald-50",
      textColor: "text-slate-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id as any)}
            className={`${card.bg} border ${card.border} rounded-xl p-5 shadow-xs transition-all duration-200 hover:shadow-sm cursor-pointer ${
              isSelected ? "ring-2 ring-indigo-500 ring-offset-1" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg ${card.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <span className={`text-2xl font-bold tracking-tight ${card.textColor}`}>
                {card.value}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-500 truncate font-medium">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
