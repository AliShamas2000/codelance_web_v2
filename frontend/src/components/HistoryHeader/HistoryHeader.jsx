import React from 'react'

const HistoryHeader = ({
  onExportReport,
  className = ""
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 ${className}`}>
      <div>
        <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-1 block">
          Overview
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#111816] dark:text-white">
          History & Activity
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Track appointments, transactions, and system updates.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onExportReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary/50 text-sm font-medium transition-colors shadow-sm group"
        >
          <span className="material-symbols-outlined text-[20px] text-gray-500 group-hover:text-primary">download</span>
          Export Report
        </button>
      </div>
    </div>
  )
}

export default HistoryHeader


