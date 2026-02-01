import React from 'react'
import { useNavigate } from 'react-router-dom'

const SettingsHeader = ({
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
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 ${className}`}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => navigate('/barber/dashboard')}
            className="text-xs font-semibold tracking-wider uppercase text-gray-400 hover:text-primary transition-colors"
          >
            Dashboard
          </button>
          <span className="text-gray-400 text-xs">/</span>
          <span className="text-primary font-semibold tracking-wider uppercase text-xs">Settings</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#111816] dark:text-white">
          General Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your dashboard preferences, notifications, and calendar rules.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-sm font-medium transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[#111816] text-sm font-bold shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#111816]"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SettingsHeader


