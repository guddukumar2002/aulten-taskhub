import React from "react";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Zap,
  Activity,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { ServiceHealth } from "../types/task";

interface IntegrationsViewProps {
  serviceHealth: ServiceHealth;
  simulateError: string | null;
  setSimulateError: (err: string | null) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  serviceHealth,
  simulateError,
  setSimulateError,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Enterprise Service Connectors</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Aulten TaskHub connects to distributed upstream systems using concurrent non-blocking
              fetch routines via <code className="text-indigo-600 font-mono">Promise.allSettled</code>.
              Even if one source experiences high latency or total downtime, the remaining systems
              continue operating seamlessly.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 w-full sm:w-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Test Ping Endpoints</span>
          </button>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* CRM Connector Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                CRM
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">CRM Enterprise Gateway</h3>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">/api/crm/tasks</span>
              </div>
            </div>

            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium border shrink-0 ${
                serviceHealth.crm.healthy
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  serviceHealth.crm.healthy ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>{serviceHealth.crm.healthy ? "Operational" : "Offline"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Ingested Records</span>
              <span className="font-bold text-slate-800 text-sm">{serviceHealth.crm.count} tasks</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Protocol</span>
              <span className="font-bold text-slate-800 text-sm">REST / JSON</span>
            </div>
          </div>

          {!serviceHealth.crm.healthy && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              <strong>Error Trace:</strong> {serviceHealth.crm.error || "Connection timed out"}
            </div>
          )}
        </div>

        {/* Helpdesk Connector Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                HD
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">Helpdesk Ticket Gateway</h3>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">/api/helpdesk/tasks</span>
              </div>
            </div>

            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium border shrink-0 ${
                serviceHealth.helpdesk.healthy
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  serviceHealth.helpdesk.healthy ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>{serviceHealth.helpdesk.healthy ? "Operational" : "Offline"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Ingested Records</span>
              <span className="font-bold text-slate-800 text-sm">{serviceHealth.helpdesk.count} tickets</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Protocol</span>
              <span className="font-bold text-slate-800 text-sm">REST / JSON</span>
            </div>
          </div>

          {!serviceHealth.helpdesk.healthy && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              <strong>Error Trace:</strong> {serviceHealth.helpdesk.error || "Connection timed out"}
            </div>
          )}
        </div>
      </div>

      {/* Fault Injection / Resiliency Test Sandbox */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-600 shrink-0" />
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
            Resilience & Fault Tolerance Simulation
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Evaluate how the dashboard behaves when individual upstream APIs fail. Clicking any button
          triggers the server-side simulation param (<code className="font-mono">?simulate_error=...</code>),
          exercising partial failure handling, banner notifications, and graceful degradation.
        </p>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setSimulateError(null)}
            className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              simulateError === null
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Systems Healthy
          </button>

          <button
            onClick={() => setSimulateError("crm")}
            className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              simulateError === "crm"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            Simulate CRM Failure (503)
          </button>

          <button
            onClick={() => setSimulateError("helpdesk")}
            className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              simulateError === "helpdesk"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            Simulate Helpdesk Failure (503)
          </button>

          <button
            onClick={() => setSimulateError("both")}
            className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
              simulateError === "both"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
            }`}
          >
            Simulate Total Outage (503)
          </button>
        </div>
      </div>
    </div>
  );
};
