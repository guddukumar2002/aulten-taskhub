// server/src/routes/portalRoutes.js
import express from "express";
import { crmTasks } from "./crmRoutes.js";
import { helpdeskTasks } from "./helpdeskRoutes.js";

const router = express.Router();

/**
 * GET /portal/:source/:id
 * Renders an authentic, responsive enterprise portal page for deep-linked CRM deals and Helpdesk tickets
 */
router.get("/:source/:id", (req, res) => {
  const { source, id } = req.params;
  const isCrm = source.toLowerCase() === "crm";
  const tasks = isCrm ? crmTasks : helpdeskTasks;
  const item = tasks.find((t) => t.id.toLowerCase() === id.toLowerCase());

  if (!item) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Record Not Found — Aulten Source Portal</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-50 text-slate-800 p-8 flex items-center justify-center min-h-screen">
        <div class="max-w-md bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm">
          <h1 class="text-lg font-bold text-slate-900">Record Not Found</h1>
          <p class="text-xs text-slate-500 mt-2">The record ${id} was not found in the ${source.toUpperCase()} gateway.</p>
        </div>
      </body>
      </html>
    `);
  }

  const primaryColor = isCrm ? "blue" : "purple";
  const portalName = isCrm ? "Aulten Enterprise CRM" : "Aulten SupportDesk Helpdesk";
  const portalSubtitle = isCrm ? "Sales Operations & Deal Pipeline" : "Enterprise Incident & Service Management";

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${item.id}: ${item.title} — ${portalName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }</style>
    </head>
    <body class="bg-slate-50 text-slate-900 min-h-screen antialiased">
      <!-- Portal Top Header -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg ${isCrm ? "bg-blue-600" : "bg-purple-600"} text-white font-bold flex items-center justify-center text-xs shadow-xs">
            ${isCrm ? "CRM" : "HD"}
          </div>
          <div>
            <h1 class="text-sm font-bold text-slate-900">${portalName}</h1>
            <p class="text-[11px] text-slate-500">${portalSubtitle}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 text-xs">
          <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Gateway Synchronized</span>
          </span>
          <span class="text-slate-400">|</span>
          <span class="text-slate-600">Logged in: <strong>${item.employeeName}</strong></span>
        </div>
      </header>

      <!-- Sync Banner -->
      <div class="max-w-5xl mx-auto mt-6 px-4">
        <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-indigo-900">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-indigo-600">⚡ Aulten TaskHub Integration Active:</span>
            <span>This ${isCrm ? "deal" : "incident"} is synchronized with your TaskHub dashboard. Real-time updates reflect in TaskHub.</span>
          </div>
          <a href="http://localhost:3000" class="font-semibold text-indigo-700 hover:text-indigo-900 underline ml-3 shrink-0">
            ← Return to TaskHub
          </a>
        </div>
      </div>

      <!-- Main Record View -->
      <main class="max-w-5xl mx-auto mt-6 px-4 pb-12 space-y-6">
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <!-- Record Meta Header -->
          <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                ${item.id}
              </span>
              <span class="text-xs font-semibold px-2.5 py-1 rounded ${
                item.priority === "Urgent"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : item.priority === "High"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
              }">
                ${item.priority} Priority
              </span>
              <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Status: ${item.status}
              </span>
            </div>

            <div class="text-xs text-slate-400">
              Created: ${new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <!-- Title and Description -->
          <div class="mt-4">
            <h2 class="text-xl font-bold text-slate-900">${item.title}</h2>
            <div class="mt-3 p-4 bg-slate-50 border border-slate-200/80 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              ${item.description || "No extended notes recorded for this item."}
            </div>
          </div>

          <!-- Metadata Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div class="p-3 bg-slate-50 rounded-lg">
              <span class="text-slate-400 block mb-0.5">Assigned Employee</span>
              <span class="font-semibold text-slate-900">${item.employeeName} (${item.employeeId})</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg">
              <span class="text-slate-400 block mb-0.5">Due / SLA Target</span>
              <span class="font-semibold text-slate-900">${new Date(item.dueDate).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            ${item.metadata?.customer ? `
              <div class="p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-400 block mb-0.5">Client Organization</span>
                <span class="font-semibold text-slate-900">${item.metadata.customer}</span>
              </div>
            ` : ""}
            ${item.metadata?.dealValue ? `
              <div class="p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-400 block mb-0.5">Commercial Value</span>
                <span class="font-semibold text-emerald-700 font-mono">${item.metadata.dealValue}</span>
              </div>
            ` : ""}
            ${item.metadata?.stage ? `
              <div class="p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-400 block mb-0.5">Pipeline Stage</span>
                <span class="font-semibold text-slate-900">${item.metadata.stage}</span>
              </div>
            ` : ""}
            ${item.metadata?.category ? `
              <div class="p-3 bg-slate-50 rounded-lg">
                <span class="text-slate-400 block mb-0.5">Category</span>
                <span class="font-semibold text-slate-900">${item.metadata.category}</span>
              </div>
            ` : ""}
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 mb-4">Audit Trail & System Activity</h3>
          <div class="space-y-4 border-l-2 border-slate-200 pl-4 text-xs">
            <div>
              <div class="font-semibold text-slate-800">Task record updated in upstream gateway</div>
              <div class="text-[11px] text-slate-400 mt-0.5">Automated synchronization routine · Today</div>
            </div>
            <div>
              <div class="font-semibold text-slate-800">Assigned to ${item.employeeName}</div>
              <div class="text-[11px] text-slate-400 mt-0.5">Work allocation engine · ${new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div class="font-semibold text-slate-800">Record initialized from ${isCrm ? "Salesforce/CRM API" : "Zendesk/Helpdesk API"}</div>
              <div class="text-[11px] text-slate-400 mt-0.5">Inbound webhook · ${new Date(item.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </main>
    </body>
    </html>
  `);
});

export { router as portalRouter };
