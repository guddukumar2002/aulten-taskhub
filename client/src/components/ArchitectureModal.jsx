// client/src/components/ArchitectureModal.jsx
import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  Layers, 
  GitBranch, 
  Cpu, 
  ShieldCheck, 
  Terminal,
  CheckCircle2,
  Workflow
} from "lucide-react";

export function ArchitectureModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("architecture");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950/40 via-slate-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                System Architecture & Interview Technical Guide
              </h3>
              <p className="text-[11px] text-slate-400">
                Aulten Digital Hiring Assignment • Prepared by Guddu Kumar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === "architecture"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Architecture & Pipeline
          </button>
          <button
            onClick={() => setActiveTab("algorithm")}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === "algorithm"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Prioritization Algorithm
          </button>
          <button
            onClick={() => setActiveTab("resilience")}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === "resilience"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Fault Tolerance & Webhooks
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className={`py-2.5 px-3 border-b-2 transition ${
              activeTab === "interview"
                ? "border-indigo-500 text-indigo-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Technical Talking Points
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {activeTab === "architecture" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Workflow className="w-4 h-4 text-indigo-400" />
                <span>Multi-Source Unified Data Pipeline</span>
              </h4>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed text-indigo-300">
                ┌────────────────────────────────┐       ┌────────────────────────────────┐<br />
                │  Mock CRM REST API (/api/crm)   │       │ Mock Helpdesk API (/api/help)  │<br />
                │  - Zoho / Salesforce Schema     │       │  - Zendesk / Jira Schema       │<br />
                └───────────────┬────────────────┘       └───────────────┬────────────────┘<br />
                                │                                         │<br />
                                └───────────────────┬─────────────────────┘<br />
                                                    ▼<br />
                              ┌───────────────────────────────────────────┐<br />
                              │  Unified Task Aggregator & Normalizer     │<br />
                              │  - Schema Harmonization                   │<br />
                              │  - Mathematical Prioritization Engine     │<br />
                              │  - Circuit-Breaker Fault Isolation        │<br />
                              └─────────────────────┬─────────────────────┘<br />
                                                    ▼<br />
                              ┌───────────────────────────────────────────┐<br />
                              │   React 19 + Tailwind Client Dashboard   │<br />
                              │   - Multi-Filter & Debounced Search       │<br />
                              │   - Table / Card / Eisenhower Matrix View │<br />
                              │   - Clickable Source Deep-Links           │<br />
                              └───────────────────────────────────────────┘
              </div>

              <div className="space-y-2">
                <h5 className="font-semibold text-white">Key Architectural Decisions:</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li><strong>Schema Normalization Layer:</strong> Disparate upstream schemas (e.g., CRM uses <code className="text-slate-200">assignedEmployee</code> & <code className="text-slate-200">dealValue</code>; Helpdesk uses <code className="text-slate-200">assignee</code> & <code className="text-slate-200">severity</code>) are harmonized into a uniform model.</li>
                  <li><strong>BFF (Backend-For-Frontend) Pattern:</strong> Instead of making the client perform multiple round-trips and complex client-side joins, the Node.js Express service acts as a BFF gateway aggregating and scoring tasks concurrently.</li>
                  <li><strong>Optimistic UI Updates:</strong> Status changes update state instantaneously on the client while dispatching PATCH requests in the background.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "algorithm" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Task Prioritization Formulation</span>
              </h4>

              <p className="text-slate-300 leading-relaxed">
                Rather than a naive chronological sort, Aulten TaskPulse applies a multi-factor mathematical scoring model:
              </p>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-300">
                PriorityScore = UrgencyWeight + DeadlineProximityScore + StatusFactor
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <h6 className="font-semibold text-white mb-2">1. Urgency Weight</h6>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Critical: <strong className="text-rose-400">+100 pts</strong></li>
                    <li>• High: <strong className="text-amber-400">+75 pts</strong></li>
                    <li>• Medium: <strong className="text-sky-400">+45 pts</strong></li>
                    <li>• Low: <strong className="text-slate-300">+20 pts</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <h6 className="font-semibold text-white mb-2">2. Deadline Proximity</h6>
                  <ul className="space-y-1 text-slate-400">
                    <li>• Overdue: <strong className="text-rose-400">+120 pts + decay penalty</strong></li>
                    <li>• Imminent (&le; 6h): <strong className="text-amber-400">+90 pts</strong></li>
                    <li>• Due Today (&le; 24h): <strong className="text-indigo-400">+60 pts</strong></li>
                    <li>• Due Soon (&le; 72h): <strong className="text-slate-300">+35 pts</strong></li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-slate-400">
                <strong className="text-white">Priority Tiers:</strong> Tasks with score &ge; 160 are classified as <strong>P1 (Critical / Urgent)</strong>; 110–159 as <strong>P2</strong>; 65–109 as <strong>P3</strong>; and &lt; 65 as <strong>P4</strong>. Completed tasks drop by -1000 pts to automatically clear the employee's active focus area.
              </div>
            </div>
          )}

          {activeTab === "resilience" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Fault Tolerance & Webhook Integration</span>
              </h4>

              <div className="space-y-3">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="font-semibold text-white mb-1">Graceful Degradation</h5>
                  <p className="text-slate-400 text-xs">
                    If the Zoho CRM API goes down or encounters an outage (500/503), the gateway catches the error, marks the CRM health flag as degraded, and immediately delivers available Helpdesk tasks. The dashboard informs the user with a dismissable banner and a live retry button.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <h5 className="font-semibold text-white mb-1">Zoho CRM & n8n Integration Strategy</h5>
                  <p className="text-slate-400 text-xs">
                    In a production deployment at Aulten Digital:
                  </p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-400">
                    <li>Zoho Workflows / Deluge triggers a webhook on deal updates to <code className="text-slate-200">/api/webhooks/zoho</code>.</li>
                    <li>The webhook payload is validated using HMAC SHA-256 signature verification.</li>
                    <li>Tasks are pushed to a Redis queue (BullMQ) for asynchronous ingestion, ensuring zero-loss even during traffic spikes.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Talking Points for Technical Interview</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <strong className="text-indigo-300">1. How did you structure the solution?</strong>
                  <p className="text-slate-400 mt-1">
                    "I built an enterprise full-stack application with a modular Node.js/Express backend that acts as an API aggregator and normalization gateway, paired with a React 19 frontend utilizing Tailwind CSS and an Eisenhower Priority Matrix."
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <strong className="text-indigo-300">2. How is task prioritization calculated?</strong>
                  <p className="text-slate-400 mt-1">
                    "Instead of basic date sorting, I engineered a mathematical scoring formula combining Urgency Weight (Critical=100) with a dynamically calculated Deadline Proximity Boost (Overdue=+120, &le;6h=+90, &le;24h=+60). This dynamically bubbles up P1 items before SLA breaches occur."
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <strong className="text-indigo-300">3. How does the system handle errors?</strong>
                  <p className="text-slate-400 mt-1">
                    "I implemented circuit-breaker style fault isolation. If one upstream service fails, the dashboard gracefully serves data from the other operational service with non-blocking user feedback and live retry support. I also built a live Resilience Lab into the app to demonstrate this in real-time."
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
}
