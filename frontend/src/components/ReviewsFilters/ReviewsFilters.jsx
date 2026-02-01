import React from 'react'

const ReviewsFilters = ({
  filters = {},
  onSearchChange,
  onRatingChange,
  onSortChange,
  className = ""
}) => {
  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none dark:text-white placeholder-gray-400"
            placeholder="Search by client name or keyword..."
            type="text"
            value={filters.search || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
          <select
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium outline-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            value={filters.rating || 'all'}
            onChange={(e) => onRatingChange && onRatingChange(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium outline-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            value={filters.sortBy || 'newest'}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default ReviewsFilters
