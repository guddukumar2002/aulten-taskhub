// client/src/components/MockSourcePortalModal.jsx
import React from "react";
import { 
  X, 
  ExternalLink, 
  Briefcase, 
  HelpCircle, 
  Clock, 
  Building, 
  User, 
  ShieldCheck, 
  FileText
} from "lucide-react";

export function MockSourcePortalModal({ task, onClose }) {
  if (!task) return null;

  const isCrm = task.source === "CRM";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d131f] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Browser Top Navigation Bar */}
        <div className="bg-[#151d2d] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="ml-3 flex items-center space-x-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-white/[0.08] text-[11px] text-slate-300 font-mono">
              <span className="text-emerald-400">https://</span>
              <span>{isCrm ? `crm.aulten.internal/deals/${task.id}` : `helpdesk.aulten.internal/tickets/${task.id}`}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source App Header */}
        <div className="p-5 sm:p-6 bg-slate-900 border-b border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className={`p-3 rounded-xl ${isCrm ? "bg-blue-600/20 text-blue-400" : "bg-purple-600/20 text-purple-400"} border border-white/10`}>
                {isCrm ? <Briefcase className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {task.id}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {task.sourcePlatform}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
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

            <div className="text-left sm:text-right">
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Specific View for CRM */}
          {isCrm ? (
            <div className="space-y-6">
              
              {/* Deal Pipeline Progression */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-white/[0.08]">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Deal Stage Progression
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {["Lead Qualification", "Proposal Review", "Contract Negotiation", "Closed Won"].map((st) => {
                    const isCurrent = task.metadata?.stage === st;
                    return (
                      <div 
                        key={st}
                        className={`p-2.5 rounded-lg border font-bold ${
                          isCurrent
                            ? "bg-indigo-600/20 text-indigo-300 border-indigo-500 shadow-sm"
                            : "bg-slate-900/60 text-slate-500 border-white/[0.05]"
                        }`}
                      >
                        {st}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deal Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>Customer Account</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.metadata?.customer}
                  </div>
                </div>

                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>Contract Deal Value</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {task.metadata?.dealValue}
                  </div>
                </div>

                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Assigned Lead</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.assignedTo.name}
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Activity Log & Notes</span>
                </h4>
                <p className="text-slate-200 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/[0.05]">
                  {task.metadata?.notes}
                </p>
              </div>

            </div>
          ) : (
            // Specific View for Helpdesk
            <div className="space-y-6">
              
              {/* Incident Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>Requester</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.metadata?.requester}
                  </div>
                </div>

                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Category</span>
                  </div>
                  <div className="text-sm font-bold text-amber-300">
                    {task.metadata?.category}
                  </div>
                </div>

                <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-slate-400 mb-1 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Assigned Engineer</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.assignedTo.name}
                  </div>
                </div>
              </div>

              {/* Problem Statement */}
              <div className="bg-slate-900/70 p-4 rounded-xl border border-white/[0.08]">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Technical Problem Statement
                </h4>
                <div className="text-slate-200 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/[0.05] font-mono">
                  {task.metadata?.description}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-[11px] text-slate-500 truncate mr-2">
            Link: <span className="font-mono text-slate-400">{task.sourceUrl}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
