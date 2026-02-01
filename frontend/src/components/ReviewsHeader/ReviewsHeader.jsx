import React from 'react'

const ReviewsHeader = ({
  onExportCSV,
  className = ""
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 ${className}`}>
      <div>
        <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-1 block">
          Feedback
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#111816] dark:text-white">
          Reviews & Ratings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your reputation and view client feedback.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary/50 text-sm font-medium transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export CSV
        </button>
      </div>
    </div>
  )
}

export default ReviewsHeader


