import React from 'react'

const FooterHeader = ({
  onCancel,
  onSave,
  isSaving = false,
  className = ""
}) => {
  return (
    <header className={`mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Footer & Contact Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Customize your website's footer, location details, and contact information.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="bg-white dark:bg-gray-700 dark:text-white text-gray-700 border border-gray-300 dark:border-gray-600 font-semibold rounded-xl text-sm px-6 py-3 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white font-semibold rounded-xl text-sm px-6 py-3 shadow-lg shadow-gray-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined mr-2">save</span>
              Save Changes
            </>
          )}
        </button>
      </div>
    </header>
  )
}

export default FooterHeader


