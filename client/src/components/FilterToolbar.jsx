// client/src/components/FilterToolbar.jsx
import React from "react";
import { 
  Search, 
  Filter, 
  RotateCcw, 
  LayoutList, 
  LayoutGrid, 
  Grid2X2,
  ArrowUpDown,
  Briefcase,
  HelpCircle,
  X
} from "lucide-react";

export function FilterToolbar({
  search,
  onSearchChange,
  employees = [],
  selectedEmployee,
  onSelectEmployee,
  selectedStatus,
  onSelectStatus,
  selectedSource,
  onSelectSource,
  selectedUrgency,
  onSelectUrgency,
  selectedSort,
  onSelectSort,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
  totalResults
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md mb-6">
      
      {/* Top Row: Search + View Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, ID (CRM-2041, HD-8810), client, employee, tags..."
            className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Switcher & Result Count */}
        <div className="flex items-center justify-between md:justify-end space-x-3">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{totalResults}</strong> tasks
          </span>

          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Table / List View"
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>

            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>

            <button
              onClick={() => onViewModeChange("matrix")}
              className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
                viewMode === "matrix"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Eisenhower Priority Matrix View"
            >
              <Grid2X2 className="w-4 h-4" />
              <span className="hidden sm:inline">Priority Matrix</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Row: Dropdown Filters & Sorting */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
        
        {/* Filter: Employee */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Employee
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => onSelectEmployee(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Assignees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.totalAssigned || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Filter: Task Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">🟡 Pending / Open</option>
            <option value="in_progress">🔵 In Progress</option>
            <option value="completed">🟢 Resolved / Completed</option>
            <option value="blocked">🟠 Blocked / Waiting</option>
          </select>
        </div>

        {/* Filter: Source Application */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Source API
          </label>
          <select
            value={selectedSource}
            onChange={(e) => onSelectSource(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="crm">💼 CRM (Zoho / Salesforce)</option>
            <option value="helpdesk">🎧 Helpdesk (Zendesk / Jira)</option>
          </select>
        </div>

        {/* Filter: Urgency Level */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Urgency
          </label>
          <select
            value={selectedUrgency}
            onChange={(e) => onSelectUrgency(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Urgencies</option>
            <option value="critical">🔴 Critical (P1)</option>
            <option value="high">🟠 High (P2)</option>
            <option value="medium">🟡 Medium (P3)</option>
            <option value="low">⚪ Low (P4)</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider flex items-center space-x-1">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>Sort By</span>
          </label>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="smart">⚡ Smart Priority Score</option>
            <option value="deadline_asc">⏰ Earliest Deadline First</option>
            <option value="urgency_desc">🔥 Urgency (Highest First)</option>
            <option value="title_asc">🔤 Title (A - Z)</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition ${
              hasActiveFilters
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                : "bg-slate-900/40 text-slate-600 border border-slate-800/50 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

      </div>

    </div>
  );
}
