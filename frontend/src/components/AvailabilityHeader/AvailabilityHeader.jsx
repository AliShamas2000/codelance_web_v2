import React from 'react'
import { useNavigate } from 'react-router-dom'

const AvailabilityHeader = ({
  onCancel,
  onSave,
  isSaving = false,
  hasChanges = false,
  className = ""
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/barber/dashboard')
    }
  }

  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#111816] dark:text-white">
            Edit Availability
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Set your weekly recurring schedule and break times.
          </p>
        </div>
      </div>
      <div className="flex gap-3 w-full md:w-auto">
        <button
          onClick={handleBack}
          className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-[#111816] font-bold text-sm shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#111816]"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">check</span>
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default AvailabilityHeader


