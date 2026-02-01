import React from 'react'

const TeamFilters = ({
  search = "",
  status = "all",
  onSearchChange,
  onStatusChange,
  onSort,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft p-4 mb-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center w-full md:w-auto space-x-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, role or email..."
            className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full md:w-48">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <span className="material-symbols-outlined text-lg">filter_alt</span>
          </span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full py-2.5 pl-10 pr-8 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="leave">On Leave</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </span>
        </div>
      </div>

      {/* Sort Button */}
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <button
          onClick={onSort}
          className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
        >
          <span className="material-symbols-outlined text-lg mr-1">sort</span>
          <span className="text-sm font-medium">Sort</span>
        </button>
      </div>
    </div>
  )
}

export default TeamFilters
