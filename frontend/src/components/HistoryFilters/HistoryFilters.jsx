import React from 'react'

const HistoryFilters = ({
  filters = {},
  onSearchChange,
  onActivityTypeChange,
  onTimePeriodChange,
  className = ""
}) => {
  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center ${className}`}>
      <div className="relative w-full lg:w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </span>
        <input
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-400 shadow-inner transition-colors"
          placeholder="Search by client, service or status..."
          type="text"
          value={filters.search || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
        <div className="relative min-w-[140px]">
          <select
            className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/50 text-gray-700 dark:text-gray-200 cursor-pointer shadow-sm transition-colors"
            value={filters.activityType || 'all'}
            onChange={(e) => onActivityTypeChange && onActivityTypeChange(e.target.value)}
          >
            <option value="all">All Activity</option>
            <option value="appointments">Appointments</option>
            <option value="cancellations">Cancellations</option>
            <option value="system">System Updates</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </div>
        </div>
        <div className="relative min-w-[140px]">
          <select
            className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/50 text-gray-700 dark:text-gray-200 cursor-pointer shadow-sm transition-colors"
            value={filters.timePeriod || 'last_30_days'}
            onChange={(e) => onTimePeriodChange && onTimePeriodChange(e.target.value)}
          >
            <option value="last_30_days">Last 30 Days</option>
            <option value="all_time">All Time</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </div>
        </div>
        <button className="flex items-center justify-center p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-primary transition-colors shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
        </button>
      </div>
    </div>
  )
}

export default HistoryFilters


