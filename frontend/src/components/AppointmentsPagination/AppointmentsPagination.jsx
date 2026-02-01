import React from 'react'

const AppointmentsPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPrevious,
  onNext,
  onPageChange,
  className = ""
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={`mt-8 bg-white dark:bg-card-dark rounded-xl shadow-soft px-6 py-4 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <span className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}-{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
      </span>
      <div className="inline-flex space-x-2">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AppointmentsPagination



