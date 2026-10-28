// client/src/components/ChaosModal.jsx
import React, { useState } from "react";
import { 
  X, 
  ShieldAlert, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Activity
} from "lucide-react";

export function ChaosModal({ 
  chaosConfig, 
  onUpdateChaos, 
  onResetChaos, 
  onClose,
  serviceHealth 
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (key, val) => {
    setLoading(true);
    try {
      await onUpdateChaos({ [key]: val });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                API Resilience & Chaos Engineering Lab
              </h3>
              <p className="text-[11px] text-slate-400">
                Demonstrates graceful degradation and fault tolerance during technical interview
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
            <p>
              In production enterprise architectures, upstream microservices (like CRM or Helpdesk) can experience intermittent timeouts, network partition, or 500 errors. 
              <strong> Aulten TaskPulse</strong> isolates failures so one downed service never brings down the entire employee dashboard.
            </p>
          </div>

          {/* Current Live Service Health */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Live Mock API Upstream Status
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                serviceHealth?.crm?.healthy
                  ? "bg-slate-950 border-slate-800"
                  : "bg-rose-950/20 border-rose-500/40 text-rose-300"
              }`}>
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Zoho CRM API</div>
                    <div className="text-[10px] text-slate-400">
                      {serviceHealth?.crm?.healthy ? "200 OK • Online" : "500 Error • Failing"}
                    </div>
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  serviceHealth?.crm?.healthy ? "bg-emerald-400" : "bg-rose-500 animate-ping"
                }`} />
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                serviceHealth?.helpdesk?.healthy
                  ? "bg-slate-950 border-slate-800"
                  : "bg-rose-950/20 border-rose-500/40 text-rose-300"
              }`}>
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Helpdesk API</div>
                    <div className="text-[10px] text-slate-400">
                      {serviceHealth?.helpdesk?.healthy ? "200 OK • Online" : "503 Unavailable • Failing"}
                    </div>
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  serviceHealth?.helpdesk?.healthy ? "bg-emerald-400" : "bg-rose-500 animate-ping"
                }`} />
              </div>
            </div>
          </div>

          {/* Chaos Toggles */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Inject Simulated Outages
            </span>

            {/* Toggle CRM Failure */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <div className="font-semibold text-slate-200">Simulate CRM API 500 Outage</div>
                <div className="text-[11px] text-slate-400">
                  Forces CRM endpoint to throw HTTP 500. Dashboard will serve Helpdesk tasks with warning.
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => handleToggle("failCrm", !chaosConfig?.failCrm)}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                  chaosConfig?.failCrm
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {chaosConfig?.failCrm ? "Failing (500)" : "Simulate Outage"}
              </button>
            </div>

            {/* Toggle Helpdesk Failure */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <div className="font-semibold text-slate-200">Simulate Helpdesk 503 Unavailable</div>
                <div className="text-[11px] text-slate-400">
                  Forces Helpdesk to throw HTTP 503. Dashboard will serve CRM tasks with warning.
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => handleToggle("failHelpdesk", !chaosConfig?.failHelpdesk)}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                  chaosConfig?.failHelpdesk
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {chaosConfig?.failHelpdesk ? "Failing (503)" : "Simulate Outage"}
              </button>
            </div>

            {/* Toggle Latency */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <div className="font-semibold text-slate-200">Simulate Network Latency (1500ms)</div>
                <div className="text-[11px] text-slate-400">
                  Demonstrates smooth skeleton / spinner loading states.
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => handleToggle("latencyMs", chaosConfig?.latencyMs > 0 ? 0 : 1500)}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                  chaosConfig?.latencyMs > 0
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {chaosConfig?.latencyMs > 0 ? "1500ms Delay ON" : "Add Latency"}
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onResetChaos}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Normal (Healthy)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
