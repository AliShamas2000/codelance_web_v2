import React from 'react'

const InformativeSectionsHeader = ({
  onAddNew,
  className = ""
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Informative Sections
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage "Why Choose Us" and "Refining the Art" sections content.
        </p>
      </div>
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-slate-900 dark:bg-primary text-white dark:text-background-dark font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 shadow-xl shadow-slate-200/50 dark:shadow-none"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Add New Section
        </button>
      )}
    </div>
  )
}

export default InformativeSectionsHeader
