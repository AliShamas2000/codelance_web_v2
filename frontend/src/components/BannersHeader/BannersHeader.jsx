import React from 'react'

const BannersHeader = ({
  onAddNew,
  className = ""
}) => {
  return (
    <div className={`flex justify-between items-end mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Active Banners
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage the promotional banners displayed on the homepage.
        </p>
      </div>
      <button
        onClick={onAddNew}
        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
      >
        + Add New Banner
      </button>
    </div>
  )
}

export default BannersHeader


