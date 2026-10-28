// client/src/components/ErrorBanner.jsx
import React from "react";
import { AlertTriangle, AlertCircle, RefreshCw, X, ServerOff } from "lucide-react";

export function ErrorBanner({ 
  serviceHealth, 
  onRetry, 
  isRetrying, 
  errorMessage, 
  onDismiss 
}) {
  const isCrmDown = serviceHealth && !serviceHealth.crm?.healthy;
  const isHelpdeskDown = serviceHealth && !serviceHealth.helpdesk?.healthy;
  const isBothDown = isCrmDown && isHelpdeskDown;

  if (!isCrmDown && !isHelpdeskDown && !errorMessage) return null;

  return (
    <div className={`mb-6 p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all ${
      isBothDown || errorMessage
        ? "bg-rose-950/40 border-rose-500/50 text-rose-200"
        : "bg-amber-950/30 border-amber-500/40 text-amber-200"
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-start sm:items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            isBothDown || errorMessage ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
          }`}>
            {isBothDown || errorMessage ? (
              <ServerOff className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="font-bold text-sm text-white">
              {isBothDown
                ? "Upstream REST Services Unavailable"
                : isCrmDown
                ? "Partial Service Degradation: Zoho CRM API Unreachable"
                : isHelpdeskDown
                ? "Partial Service Degradation: Helpdesk API Unreachable"
                : "System Notice"}
            </div>
            
            <p className="text-xs text-slate-300 mt-0.5">
              {errorMessage || (
                isBothDown
                  ? "Both CRM and Helpdesk endpoints are currently unresponsive. Check backend server connection."
                  : isCrmDown
                  ? `CRM endpoint failed (${serviceHealth.crm.error || "HTTP 500"}). Operating in fault-tolerant mode with Helpdesk tasks.`
                  : `Helpdesk endpoint failed (${serviceHealth.helpdesk.error || "HTTP 503"}). Operating in fault-tolerant mode with CRM tasks.`
              )}
            </p>
          </div>
        </div>

        {/* Retry & Dismiss Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Retrying..." : "Retry Upstream"}</span>
          </button>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
