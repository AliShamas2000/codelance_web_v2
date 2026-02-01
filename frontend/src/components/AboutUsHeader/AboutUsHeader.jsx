import React from 'react'

const AboutUsHeader = ({
  onAddNew,
  className = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
      <nav className="flex text-sm text-text-muted">
        <span className="hover:text-primary cursor-pointer transition-colors">Pages</span>
        <span className="mx-2">/</span>
        <span className="hover:text-primary cursor-pointer transition-colors">Homepage</span>
        <span className="mx-2">/</span>
        <span className="text-text-main font-medium dark:text-white">Sections</span>
      </nav>
      <button
        onClick={onAddNew}
        className="flex items-center justify-center rounded-lg bg-text-main dark:bg-white px-4 py-2 text-sm font-bold text-white dark:text-text-main hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined text-lg mr-2">add</span>
        New Section
      </button>
    </div>
  )
}

export default AboutUsHeader


