import React, { useState, useRef, useEffect } from 'react'

const ContactSubmissionsFilters = ({
  search = '',
  status = 'all',
  projectId = 'all',
  sortBy = 'created_at',
  sortOrder = 'desc',
  projects = [],
  onSearchChange,
  onStatusChange,
  onProjectChange,
  onSort,
  className = ""
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false)
  const sortMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false)
      }
    }

    if (showSortMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSortMenu])

  const sortOptions = [
    { value: 'created_at', label: 'Date Submitted' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'status', label: 'Status' },
  ]

  const orderOptions = [
    { value: 'asc', label: 'Ascending', icon: 'arrow_upward' },
    { value: 'desc', label: 'Descending', icon: 'arrow_downward' }
  ]

  const getSortLabel = () => {
    const sortOption = sortOptions.find(opt => opt.value === sortBy)
    return sortOption ? sortOption.label : 'Sort'
  }

  const handleSortChange = (newSortBy) => {
    onSort(newSortBy, sortOrder)
    setShowSortMenu(false)
  }

  const handleOrderChange = (newOrder) => {
    onSort(sortBy, newOrder)
  }

  return (
    <div className={`mb-6 flex flex-col md:flex-row gap-4 ${className}`}>
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search submissions..."
            className="w-full py-2 pl-10 pr-4 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 dark:text-gray-200"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>

        {/* Project Filter */}
        <select
          value={projectId}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 dark:text-gray-200"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="relative" ref={sortMenuRef}>
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">sort</span>
          <span>{getSortLabel()}</span>
          <span className="material-symbols-outlined text-sm">
            {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
          <span className="material-symbols-outlined text-sm">
            {showSortMenu ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showSortMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sort By
              </div>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                    sortBy === option.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.value && (
                    <span className="material-symbols-outlined text-sm">check</span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order
              </div>
              {orderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOrderChange(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                    sortOrder === option.value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">
                      {option.icon}
                    </span>
                    <span>{option.label}</span>
                  </div>
                  {sortOrder === option.value && (
                    <span className="material-symbols-outlined text-sm">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactSubmissionsFilters

