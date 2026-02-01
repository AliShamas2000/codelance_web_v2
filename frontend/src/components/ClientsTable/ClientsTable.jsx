import React, { useState, useEffect, useRef } from 'react'
import ClientRow from '../ClientRow/ClientRow'

const ClientsTable = ({
  clients = [],
  filters = {},
  onSearchChange,
  onSortChange,
  onFilterChange,
  onViewProfile,
  onMessage,
  onDelete,
  onAddNote,
  className = ""
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const filterMenuRef = useRef(null)

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false)
      }
    }

    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilterMenu])

  const sortOptions = [
    { value: 'recent_visit', label: 'Sort by: Recent Visit' },
    { value: 'name_az', label: 'Sort by: Name A-Z' },
    { value: 'total_visits', label: 'Sort by: Total Visits' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'new', label: 'New' },
    { value: 'inactive', label: 'Inactive' }
  ]

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      {/* Filters Bar */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-sm focus:border-primary focus:ring-primary dark:text-white transition-colors"
            placeholder="Search clients by name, phone..."
            type="text"
            value={filters.search || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterChange && onFilterChange(option.value)
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      filters.status === option.value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <select
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm font-medium focus:border-primary focus:ring-primary cursor-pointer transition-colors"
            value={filters.sortBy || 'recent_visit'}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Client Name</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Total Visits</th>
              <th className="px-6 py-4">Last Visit</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onViewProfile={onViewProfile}
                  onMessage={onMessage}
                  onDelete={onDelete}
                  onAddNote={onAddNote}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientsTable
