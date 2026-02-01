import React from 'react'

const GalleryHeader = ({
  onAddNew,
  className = ""
}) => {
  return (
    <header className={`mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gallery Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your photo gallery and showcase your best work.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onAddNew}
          className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-semibold rounded-xl text-sm px-6 py-3 shadow-lg shadow-gray-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 flex items-center"
        >
          <span className="material-symbols-outlined mr-2">add_photo_alternate</span>
          Add New Image
        </button>
      </div>
    </header>
  )
}

export default GalleryHeader


