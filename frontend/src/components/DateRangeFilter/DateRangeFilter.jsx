import React from 'react'

const DateRangeFilter = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onRefresh,
  onReset,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* From Date */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            From
          </label>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange && onFromDateChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-gray-900 dark:focus:ring-primary focus:border-gray-900 dark:focus:border-primary block p-2.5"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
            </div>
          </div>
        </div>

        {/* To Date */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            To
          </label>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange && onToDateChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-gray-900 dark:focus:ring-primary focus:border-gray-900 dark:focus:border-primary block p-2.5"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-4 flex space-x-3">
          <button
            onClick={onRefresh}
            className="flex-1 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm mr-2">refresh</span>
            Refresh
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 text-gray-900 dark:text-white border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm mr-2">close</span>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateRangeFilter
