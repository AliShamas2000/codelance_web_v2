import React from 'react'

const InformativeSectionsPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  className = ""
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className={`p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#10221c] flex items-center justify-between ${className}`}>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-bold text-slate-900 dark:text-white">{startItem}-{endItem}</span> of{' '}
        <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> sections
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-white dark:hover:bg-white/5 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 hover:bg-white dark:hover:bg-white/5 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  )
}

export default InformativeSectionsPagination


