// client/src/components/SystemDocsModal.jsx
import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Workflow,
  CheckCircle2
} from "lucide-react";

export function SystemDocsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("architecture");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                System Architecture & Documentation
              </h3>
              <p className="text-[11px] text-slate-400">
                TaskPulse Centralized Task Hub • Technical Specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (3 Legitimate Technical Tabs) */}
        <div className="flex border-b border-white/[0.08] bg-slate-950/60 px-4 sm:px-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`py-3 px-3.5 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "architecture"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Architecture & Data Flow</span>
          </button>

          <button
            onClick={() => setActiveTab("algorithm")}
            className={`py-3 px-3.5 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "algorithm"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Prioritization Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("resilience")}
            className={`py-3 px-3.5 border-b-2 transition flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "resilience"
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Integration & Reliability</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* TAB 1: Architecture & Data Flow */}
          {activeTab === "architecture" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Workflow className="w-4 h-4 text-indigo-400" />
                <span>Multi-Source Unified Ingestion Pipeline</span>
              </h4>

              <div className="bg-slate-950/90 p-4 rounded-xl border border-white/[0.08] font-mono text-[11px] leading-relaxed text-indigo-300 overflow-x-auto">
                ┌──────────────────────────────┐       ┌──────────────────────────────┐<br />
                │     CRM REST API (/api/crm)  │       │ Helpdesk REST API (/api/help)│<br />
                │     • Deals & Accounts       │       │ • Incidents & Support Tickets│<br />
                └──────────────┬───────────────┘       └──────────────┬───────────────┘<br />
                               │                                      │<br />
                               └──────────────────┬───────────────────┘<br />
                                                  ▼<br />
                             ┌────────────────────────────────────────┐<br />
                             │  TaskPulse BFF Aggregator & Normalizer │<br />
                             │  • Disparate Schema Harmonization      │<br />
                             │  • Priority Evaluation & Scoring Engine│<br />
                             │  • Fault Isolation & Health Check      │<br />
                             └────────────────────┬───────────────────┘<br />
                                                  ▼<br />
                             ┌────────────────────────────────────────┐<br />
                             │       React 19 + Tailwind Client       │<br />
                             │  • Table / Card / Matrix Views         │<br />
                             │  • Multi-Filter & Debounced Search     │<br />
                             │  • Direct Source Application Linking   │<br />
                             └────────────────────────────────────────┘
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-white">System Design Rationale:</h5>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong>BFF (Backend-For-Frontend) Pattern:</strong> A dedicated Node.js Express service acts as an API gateway, aggregating upstream CRM and Helpdesk REST services concurrently to eliminate multiple client-side round trips and avoid exposing internal upstream tokens.</li>
                  <li><strong>Schema Normalization Layer:</strong> Incompatible schemas (e.g. CRM uses <code className="text-slate-200">assignedEmployee</code> & <code className="text-slate-200">dealValue</code>; Helpdesk uses <code className="text-slate-200">assignee</code> & <code className="text-slate-200">severity</code>) are normalized into a unified, extensible data model before reaching the UI.</li>
                  <li><strong>Optimistic State Updates:</strong> When users update task status (e.g. Pending &rarr; In Progress &rarr; Resolved), the UI updates immediately for responsive feedback while dispatching asynchronous PATCH requests in the background.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Prioritization Engine */}
          {activeTab === "algorithm" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Multi-Factor Priority Scoring Engine</span>
              </h4>

              <p className="text-slate-300 leading-relaxed">
                Rather than basic chronological or alphabetical sorting, tasks are prioritized using a dynamic multi-factor evaluation algorithm:
              </p>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-white/[0.08] font-mono text-xs text-amber-300">
                Priority Score = Urgency Weight + Deadline Proximity Score + Status Factor
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-white/[0.08]">
                  <h6 className="font-bold text-white mb-2">1. Base Urgency Weights</h6>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Critical / P0: <strong className="text-rose-400">+100 pts</strong></li>
                    <li>• High: <strong className="text-amber-400">+75 pts</strong></li>
                    <li>• Medium: <strong className="text-sky-400">+45 pts</strong></li>
                    <li>• Low / Routine: <strong className="text-slate-300">+20 pts</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-white/[0.08]">
                  <h6 className="font-bold text-white mb-2">2. Deadline Proximity</h6>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Overdue (&Delta;h &lt; 0): <strong className="text-rose-400">+120 pts + decay penalty</strong></li>
                    <li>• Imminent (&le; 6h): <strong className="text-amber-400">+90 pts</strong></li>
                    <li>• Due Today (&le; 24h): <strong className="text-indigo-400">+60 pts</strong></li>
                    <li>• Due Soon (&le; 72h): <strong className="text-slate-300">+35 pts</strong></li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-white/[0.08] text-slate-400">
                <strong className="text-white">Classification Tiers:</strong> Items with score &ge; 160 are classified as <strong>P1 Critical</strong>; 110–159 as <strong>P2 High</strong>; 65–109 as <strong>P3 Medium</strong>; and &lt; 65 as <strong>P4 Routine</strong>. Completed items receive a -1000 penalty, automatically clearing them from the active queue.
              </div>
            </div>
          )}

          {/* TAB 3: Integration & Reliability */}
          {activeTab === "resilience" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Upstream Reliability & Webhook Architecture</span>
              </h4>

              <div className="space-y-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/[0.08]">
                  <h5 className="font-bold text-white mb-1">Graceful Degradation</h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    If an external upstream REST service (such as CRM) encounters downtime or network timeouts, the gateway isolates the failure, tags the affected service as degraded, and continues delivering operational tasks from Helpdesk. The frontend provides non-blocking feedback and automatic retry capabilities.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/[0.08]">
                  <h5 className="font-bold text-white mb-1">Production Webhook Architecture</h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    In enterprise multi-tenant deployments:
                  </p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-400">
                    <li>External systems (CRM/Helpdesk) send event notifications via webhooks upon ticket/deal updates.</li>
                    <li>Payloads are authenticated using SHA-256 HMAC signature verification to prevent tampering.</li>
                    <li>Incoming events are dispatched to a queue worker (e.g. Redis / BullMQ) for asynchronous processing, ensuring zero packet loss during peak traffic spikes.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
}
