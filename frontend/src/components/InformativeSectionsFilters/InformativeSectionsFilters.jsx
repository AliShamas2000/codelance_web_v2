import React from 'react'

const InformativeSectionsFilters = ({
  search = "",
  onSearchChange,
  onFilter,
  onSort,
  className = ""
}) => {
  return (
    <div className={`p-5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#10221c] ${className}`}>
      <div className="relative w-full md:w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search sections..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={onFilter}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">filter_list</span>
          Filter
        </button>
        <button
          onClick={onSort}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">sort</span>
          Sort
        </button>
      </div>
    </div>
  )
}

export default InformativeSectionsFilters


