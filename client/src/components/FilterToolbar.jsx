// client/src/components/FilterToolbar.jsx
import React, { useState } from "react";
import { 
  Search, 
  RotateCcw, 
  LayoutList, 
  LayoutGrid, 
  Grid2X2, 
  SlidersHorizontal,
  X,
  Flame,
  Clock,
  Briefcase,
  HelpCircle,
  CheckCircle2,
  ChevronDown
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="glass-panel-elevated rounded-2xl p-3.5 sm:p-5 mb-6 space-y-3.5">
      
      {/* Top Row: Search Input + View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, ID (CRM-2041, HD-8810), client, employee, tag..."
            className="w-full bg-slate-950/70 border border-white/[0.1] focus:border-indigo-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner"
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

        {/* View Switcher & Filter Toggle for Mobile */}
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          
          {/* Toggle for Advanced Filters on mobile */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`sm:hidden px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${
              showAdvancedFilters || hasActiveFilters
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                : "bg-slate-900 text-slate-400 border-white/[0.08]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-400 ml-1" />
            )}
          </button>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-white/[0.08] shadow-inner">
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden md:inline">Table</span>
            </button>

            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Cards</span>
            </button>

            <button
              onClick={() => onViewModeChange("matrix")}
              className={`p-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                viewMode === "matrix"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Eisenhower Matrix"
            >
              <Grid2X2 className="w-4 h-4" />
              <span className="hidden md:inline">Matrix</span>
            </button>
          </div>

        </div>

      </div>

      {/* Quick Filter Preset Chips (Fast 1-click filtering) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0 mr-1 hidden sm:inline">
          Quick Filters:
        </span>

        <button
          onClick={() => {
            onSelectUrgency(selectedUrgency === "critical" ? "all" : "critical");
          }}
          className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs flex items-center space-x-1 border transition ${
            selectedUrgency === "critical"
              ? "bg-rose-500/20 text-rose-300 border-rose-500"
              : "bg-slate-900/60 text-slate-400 border-white/[0.08] hover:text-slate-200"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>P1 Critical</span>
        </button>

        <button
          onClick={() => {
            onSelectStatus(selectedStatus === "pending" ? "all" : "pending");
          }}
          className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs flex items-center space-x-1 border transition ${
            selectedStatus === "pending"
              ? "bg-amber-500/20 text-amber-300 border-amber-500"
              : "bg-slate-900/60 text-slate-400 border-white/[0.08] hover:text-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Pending / Due Today</span>
        </button>

        <button
          onClick={() => {
            onSelectSource(selectedSource === "crm" ? "all" : "crm");
          }}
          className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs flex items-center space-x-1 border transition ${
            selectedSource === "crm"
              ? "bg-blue-500/20 text-blue-300 border-blue-500"
              : "bg-slate-900/60 text-slate-400 border-white/[0.08] hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          <span>Zoho CRM</span>
        </button>

        <button
          onClick={() => {
            onSelectSource(selectedSource === "helpdesk" ? "all" : "helpdesk");
          }}
          className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs flex items-center space-x-1 border transition ${
            selectedSource === "helpdesk"
              ? "bg-purple-500/20 text-purple-300 border-purple-500"
              : "bg-slate-900/60 text-slate-400 border-white/[0.08] hover:text-slate-200"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>Helpdesk</span>
        </button>

        <button
          onClick={() => {
            onSelectStatus(selectedStatus === "completed" ? "all" : "completed");
          }}
          className={`flex-shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full font-bold text-xs flex items-center space-x-1 border transition ${
            selectedStatus === "completed"
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500"
              : "bg-slate-900/60 text-slate-400 border-white/[0.08] hover:text-slate-200"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Resolved</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex-shrink-0 ml-auto px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-full border border-white/[0.1] transition flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Collapsible / Responsive Dropdown Controls */}
      <div className={`pt-3 border-t border-white/[0.08] ${showAdvancedFilters ? "block" : "hidden sm:block"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* 1. Employee Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Assignee Filter
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => onSelectEmployee(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.1] text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
            >
              <option value="all">👥 All Assignees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.totalAssigned || 0} tasks)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Task Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.1] text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
            >
              <option value="all">⚡ All Statuses</option>
              <option value="pending">🟡 Pending / Open</option>
              <option value="in_progress">🔵 In Progress</option>
              <option value="completed">🟢 Resolved / Done</option>
              <option value="blocked">🟠 Blocked / Waiting</option>
            </select>
          </div>

          {/* 3. Source Application Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Source System
            </label>
            <select
              value={selectedSource}
              onChange={(e) => onSelectSource(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.1] text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
            >
              <option value="all">🌐 All Sources (CRM + Helpdesk)</option>
              <option value="crm">💼 Zoho CRM / Salesforce</option>
              <option value="helpdesk">🎧 Helpdesk / Jira Service</option>
            </select>
          </div>

          {/* 4. Urgency Level Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Urgency Level
            </label>
            <select
              value={selectedUrgency}
              onChange={(e) => onSelectUrgency(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.1] text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
            >
              <option value="all">🎯 All Urgency Levels</option>
              <option value="critical">🔴 Critical (P1)</option>
              <option value="high">🟠 High (P2)</option>
              <option value="medium">🟡 Medium (P3)</option>
              <option value="low">⚪ Routine (P4)</option>
            </select>
          </div>

          {/* 5. Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Sorting Criteria
            </label>
            <select
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.1] text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
            >
              <option value="smart">⚡ Smart Priority Score (Calculated)</option>
              <option value="deadline_asc">⏰ Earliest Deadline First</option>
              <option value="urgency_desc">🔥 Urgency (Highest First)</option>
              <option value="title_asc">🔤 Title (A - Z)</option>
            </select>
          </div>

        </div>
      </div>

    </div>
  );
}
