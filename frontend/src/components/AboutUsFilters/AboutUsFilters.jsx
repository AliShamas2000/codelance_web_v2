import React from 'react'

const AboutUsFilters = ({
  search = '',
  onSearchChange,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-[#10221c] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary dark:text-white"
            placeholder="Search sections..."
            type="text"
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default AboutUsFilters


