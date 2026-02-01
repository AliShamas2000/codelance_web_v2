import React from 'react'

const ClientsHeader = ({
  onAddClient,
  onExportCSV,
  className = ""
}) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 ${className}`}>
      <div>
        <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-1 block">
          Customer Management
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#111816] dark:text-white">
          My Clients
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your regulars and view client history.
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
        <button
          onClick={onAddClient}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[#111816] text-sm font-bold shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Client
        </button>
      </div>
    </div>
  )
}

export default ClientsHeader


