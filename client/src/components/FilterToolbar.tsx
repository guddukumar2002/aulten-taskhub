import React from "react";
import { Filter, X, ArrowUpDown, Search } from "lucide-react";
import { Employee, TaskFilterParams } from "../types/task";

interface FilterToolbarProps {
  filters: TaskFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterParams>>;
  employees: Employee[];
  totalTasks: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  setFilters,
  employees,
  totalTasks,
  filteredCount,
  onClearFilters
}) => {
  const isFiltered = Boolean(
    (filters.search && filters.search.trim() !== "") ||
    (filters.employeeId && filters.employeeId !== "all") ||
    (filters.status && filters.status !== "all") ||
    (filters.priority && filters.priority !== "all") ||
    (filters.source && filters.source !== "all") ||
    (filters.sort && filters.sort !== "priority_score")
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, descriptions, IDs, or employees..."
            value={filters.search || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            className="w-full pl-9 pr-8 py-2 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: "", page: 1 }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-medium text-slate-500 shrink-0 flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-slate-400" /> Sort:
          </span>
          <select
            value={filters.sort || "priority_score"}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }))}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="priority_score">Priority Score (Recommended)</option>
            <option value="deadline_asc">Earliest Deadline</option>
            <option value="priority_desc">Highest Priority Level</option>
            <option value="title_asc">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Selects Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Employee Dropdown */}
          <select
            value={filters.employeeId || "all"}
            onChange={(e) => setFilters((prev) => ({ ...prev, employeeId: e.target.value, page: 1 }))}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md px-2.5 py-1.5 sm:py-1 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
          >
            <option value="all">All Assignees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={filters.status || "all"}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md px-2.5 py-1.5 sm:py-1 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={filters.priority || "all"}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value, page: 1 }))}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md px-2.5 py-1.5 sm:py-1 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Source Dropdown */}
          <select
            value={filters.source || "all"}
            onChange={(e) => setFilters((prev) => ({ ...prev, source: e.target.value, page: 1 }))}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-md px-2.5 py-1.5 sm:py-1 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Sources</option>
            <option value="CRM">CRM Only</option>
            <option value="Helpdesk">Helpdesk Only</option>
          </select>

          {/* Clear Button */}
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 sm:py-1 rounded transition-colors"
            >
              <X className="w-3 h-3 mr-1" /> Clear Filters
            </button>
          )}
        </div>

        {/* Counter Badge */}
        <div className="text-[11px] sm:text-xs text-slate-500 font-medium text-right sm:text-left shrink-0">
          Showing <span className="font-semibold text-slate-800">{filteredCount}</span> of{" "}
          <span className="font-semibold text-slate-800">{totalTasks}</span> tasks
        </div>
      </div>
    </div>
  );
};
