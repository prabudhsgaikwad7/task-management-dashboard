import React from 'react';
import type { TaskFilters as FilterType, Employee, Store } from '../../types';
import { 
  Search, 
  Calendar, 
  User, 
  Store as StoreIcon, 
  ArrowUpDown, 
  X, 
  SlidersHorizontal 
} from 'lucide-react';

interface TaskFiltersProps {
  filters: FilterType;
  onChange: (newFilters: Partial<FilterType>) => void;
  onReset: () => void;
  employees: Employee[];
  stores: Store[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onChange,
  onReset,
  employees,
  stores,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.assigneeId !== 'all' ||
    filters.storeId !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.dateFilter !== 'all' ||
    filters.startDate ||
    filters.endDate
  );

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Overdue', label: 'Overdue' },
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Due Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'overdue', label: 'Overdue Dates' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'Urgent', label: 'Urgent' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 mb-6 transition-all">
      {/* Primary Bar: Search + Quick Status Filter + Advanced Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks by title, keyword, employee, store or tag..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Status Select */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            {statusOptions.map((opt) => {
              const active = filters.status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ status: opt.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Toggle More Filters Button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors shrink-0 ${
              showAdvanced || hasActiveFilters
                ? 'bg-brand-50 border-brand-200 text-brand-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filter Row (Expandable or Visible on large screens) */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
          {/* Employee Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Employee / Assignee
            </label>
            <select
              value={filters.assigneeId}
              onChange={(e) => onChange({ assigneeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Store Location Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <StoreIcon className="w-3.5 h-3.5 text-slate-400" />
              Store Location
            </label>
            <select
              value={filters.storeId}
              onChange={(e) => onChange({ storeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            >
              <option value="all">All Store Locations</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code} - {s.city})
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due Date Filter
            </label>
            <select
              value={filters.dateFilter}
              onChange={(e) =>
                onChange({
                  dateFilter: e.target.value as FilterType['dateFilter'],
                })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            >
              {dateOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority & Sort */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              Sort By & Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.priority}
                onChange={(e) => onChange({ priority: e.target.value })}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
              >
                {priorityOptions.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-') as [
                    FilterType['sortBy'],
                    FilterType['sortOrder']
                  ];
                  onChange({ sortBy, sortOrder });
                }}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
              >
                <option value="dueDate-asc">Due Date (Earliest)</option>
                <option value="dueDate-desc">Due Date (Latest)</option>
                <option value="priority-desc">Priority (Urgent first)</option>
                <option value="createdAt-desc">Created (Newest first)</option>
                <option value="title-asc">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Custom Date Range Picker */}
      {filters.dateFilter === 'custom' && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
          <span className="text-xs font-semibold text-amber-900">Custom Date Range:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">From:</span>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">To:</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      )}

      {/* Active Filter Chips & Reset */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Active filters:
            </span>

            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-700 border border-slate-200">
                Search: "{filters.search}"
                <button onClick={() => onChange({ search: '' })}>
                  <X className="w-3 h-3 hover:text-slate-900" />
                </button>
              </span>
            )}

            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-xs text-brand-700 border border-brand-200">
                Status: {filters.status}
                <button onClick={() => onChange({ status: 'all' })}>
                  <X className="w-3 h-3 hover:text-brand-900" />
                </button>
              </span>
            )}

            {filters.assigneeId !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-xs text-indigo-700 border border-indigo-200">
                Employee: {employees.find((e) => e.id === filters.assigneeId)?.name || filters.assigneeId}
                <button onClick={() => onChange({ assigneeId: 'all' })}>
                  <X className="w-3 h-3 hover:text-indigo-900" />
                </button>
              </span>
            )}

            {filters.storeId !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-xs text-emerald-700 border border-emerald-200">
                Store: {stores.find((s) => s.id === filters.storeId)?.code || filters.storeId}
                <button onClick={() => onChange({ storeId: 'all' })}>
                  <X className="w-3 h-3 hover:text-emerald-900" />
                </button>
              </span>
            )}

            {filters.dateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-xs text-amber-700 border border-amber-200">
                Date: {filters.dateFilter}
                <button onClick={() => onChange({ dateFilter: 'all', startDate: undefined, endDate: undefined })}>
                  <X className="w-3 h-3 hover:text-amber-900" />
                </button>
              </span>
            )}

            {filters.priority !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-xs text-orange-700 border border-orange-200">
                Priority: {filters.priority}
                <button onClick={() => onChange({ priority: 'all' })}>
                  <X className="w-3 h-3 hover:text-orange-900" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={onReset}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline flex items-center gap-1 ml-auto"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
