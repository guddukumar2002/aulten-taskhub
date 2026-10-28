// client/src/components/MockSourcePortalModal.jsx
import React from "react";
import { 
  X, 
  ExternalLink, 
  Briefcase, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Building,
  User,
  ShieldCheck,
  FileText
} from "lucide-react";

export function MockSourcePortalModal({ task, onClose }) {
  if (!task) return null;

  const isCrm = task.source === "CRM";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d131f] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Simulated Browser Address Bar */}
        <div className="bg-[#151d2d] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="ml-3 flex items-center space-x-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono">
              <span className="text-emerald-400">https://</span>
              <span>{isCrm ? `crm.aulten.internal/deals/${task.id}` : `helpdesk.aulten.internal/tickets/${task.id}`}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Live Source Simulation
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source App Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-[#131b2e] border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${isCrm ? "bg-blue-600/20 text-blue-400" : "bg-purple-600/20 text-purple-400"} border border-white/10`}>
                {isCrm ? <Briefcase className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {task.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {task.sourcePlatform}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                    task.urgency === "critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {task.urgency}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {task.title}
                </h2>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                SLA / Deadline
              </div>
              <div className="text-sm font-bold text-amber-400 flex items-center sm:justify-end space-x-1 mt-0.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{task.timeRemainingFormatted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Specific View for CRM */}
          {isCrm ? (
            <div className="space-y-6">
              
              {/* Deal Pipeline Progression */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Enterprise Deal Stage Progression
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {["Lead Qualification", "Proposal Review", "Contract Negotiation", "Closed Won"].map((st, i) => {
                    const isCurrent = task.metadata?.stage === st;
                    return (
                      <div 
                        key={st}
                        className={`p-2.5 rounded-lg border font-medium ${
                          isCurrent
                            ? "bg-indigo-600/20 text-indigo-300 border-indigo-500"
                            : "bg-slate-900/60 text-slate-500 border-slate-800"
                        }`}
                      >
                        {st}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deal Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5" />
                    <span>Customer Account</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.metadata?.customer}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Contract Deal Value</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {task.metadata?.dealValue}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Assigned Lead</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.assignedTo.name} ({task.assignedTo.department})
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>CRM Activity Log & Integration Notes</span>
                </h4>
                <p className="text-slate-200 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  {task.metadata?.notes}
                </p>
              </div>

            </div>
          ) : (
            // Specific View for Helpdesk
            <div className="space-y-6">
              
              {/* Incident / Ticket Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Requester / Stakeholder</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.metadata?.requester}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Category & Incident Tier</span>
                  </div>
                  <div className="text-sm font-bold text-amber-300">
                    {task.metadata?.category}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Assigned Engineer</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.assignedTo.name} ({task.assignedTo.role})
                  </div>
                </div>
              </div>

              {/* Incident Diagnostic Description */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Technical Problem Statement
                </h4>
                <div className="text-slate-200 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono">
                  {task.metadata?.description}
                </div>
              </div>

              {/* Incident Resolution Thread Preview */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ticket Communication History
                </h4>
                <div className="flex items-start space-x-3 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <img
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{task.assignedTo.name}</span>
                      <span className="text-[10px] text-slate-500">Auto-assigned via Round Robin</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Acknowledged P0 incident. Investigating telemetry worker logs and buffer saturation in Bawana factory gateway.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Source Link: <span className="font-mono text-slate-400">{task.sourceUrl}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
            >
              Close Portal View
            </button>
            <a
              href={task.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <span>Open in New Browser Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
