import React from 'react'

const AppointmentsFilters = ({
  searchQuery = "",
  selectedBarber = "",
  selectedDate = "",
  barbers = [],
  onSearchChange,
  onBarberChange,
  onDateChange,
  onRefresh,
  hideBarberFilter = false,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft p-4 mb-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-card-dark/90 ${className}`}>
      <div className="flex items-center w-full md:w-auto space-x-4">
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search client, ID or service..."
            className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 transition-colors"
          />
        </div>

        {/* Barber Filter */}
        {!hideBarberFilter && (
        <div className="relative w-full md:w-48">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <span className="material-symbols-outlined text-lg">filter_alt</span>
          </span>
          <select
            value={selectedBarber}
            onChange={(e) => onBarberChange && onBarberChange(e.target.value)}
            className="w-full py-2.5 pl-10 pr-8 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
          >
            <option value="">All Barbers</option>
            {barbers.map((barber) => (
              <option key={barber.id || barber.name} value={barber.id || barber.name}>
                {barber.name}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </span>
        </div>
        )}
      </div>

      {/* Date and Refresh */}
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <div className="relative">
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => onDateChange && onDateChange(e.target.value || '')}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-3 pr-10 py-2.5"
            placeholder="All dates"
          />
          {selectedDate && (
            <button
              onClick={() => onDateChange && onDateChange('')}
              className="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Clear date filter"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default AppointmentsFilters



