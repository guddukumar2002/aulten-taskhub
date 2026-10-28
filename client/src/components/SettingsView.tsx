import React from "react";
import { Sliders, ShieldCheck, Cpu, Code2, Database, HelpCircle } from "lucide-react";

export const SettingsView: React.FC = () => {
  const scoringRules = [
    { rule: "Overdue active task", points: "+100 pts", category: "Urgency", rationale: "Prevents SLA breaches" },
    { rule: "Due calendar today", points: "+70 pts", category: "Urgency", rationale: "End-of-day target deliverables" },
    { rule: "Due within 24 hours", points: "+60 pts", category: "Urgency", rationale: "Imminent deadline proximity" },
    { rule: "Due within 3 days", points: "+40 pts", category: "Urgency", rationale: "Short-range scheduled sprint" },
    { rule: "Due within 7 days", points: "+20 pts", category: "Urgency", rationale: "Weekly planning horizon" },
    { rule: "Urgent priority flag", points: "+50 pts", category: "Severity", rationale: "Executive escalation or outage" },
    { rule: "High priority flag", points: "+30 pts", category: "Severity", rationale: "Significant business impact" },
    { rule: "Medium priority flag", points: "+15 pts", category: "Severity", rationale: "Standard client request" },
    { rule: "Low priority flag", points: "+5 pts", category: "Severity", rationale: "Non-critical administrative task" },
    { rule: "Blocked status modifier", points: "+10 pts", category: "Bottleneck", rationale: "Requires supervisor unblocking" },
    { rule: "Completed status modifier", points: "-1000 pts", category: "Resolution", rationale: "Archived to bottom of list" }
  ];

  const tiers = [
    { tier: "P1", threshold: "Score ≥ 120", badge: "bg-rose-600 text-white", desc: "Critical urgency (Overdue or Urgent Due Today)" },
    { tier: "P2", threshold: "Score 70 – 119", badge: "bg-orange-500 text-white", desc: "High priority (Due Today or Urgent within 3 days)" },
    { tier: "P3", threshold: "Score 35 – 69", badge: "bg-indigo-600 text-white", desc: "Medium priority (Due within week or High Priority)" },
    { tier: "P4", threshold: "Score < 35", badge: "bg-slate-500 text-white", desc: "Standard backlog / low urgency tasks" },
    { tier: "Done", threshold: "Completed", badge: "bg-emerald-600 text-white", desc: "Archived resolved work items" }
  ];

  return (
    <div className="space-y-6">
      {/* Scoring Engine Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Deterministic Prioritization Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Mathematical scoring model calculating real-time urgency across CRM & Helpdesk tasks
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Condition / Rule</th>
                <th className="py-2.5 px-3">Point Weight</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Business Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {scoringRules.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{r.rule}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{r.points}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {r.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{r.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Priority Tier Classification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {tiers.map((t) => (
            <div key={t.tier} className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${t.badge}`}>{t.tier}</span>
                <span className="font-mono text-[11px] text-slate-500 font-semibold">
                  {t.threshold}
                </span>
              </div>
              <p className="text-xs text-slate-600">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Platform Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-1">Product</span>
            <span className="font-semibold text-slate-800">Aulten TaskHub Enterprise</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-1">Core Stack</span>
            <span className="font-semibold text-slate-800">React 19 · Vite 8 · Tailwind v4 · Express</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-1">Candidate Assessment</span>
            <span className="font-semibold text-slate-800">Guddu Kumar — Full Stack Developer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
