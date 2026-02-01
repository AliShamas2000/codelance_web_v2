import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileHeader = ({
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
        <nav aria-label="Breadcrumb" className="flex mb-2">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate('/barber/dashboard')}
                className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
              >
                Dashboard
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-gray-400 text-sm mx-1">chevron_right</span>
                <button
                  onClick={() => navigate('/barber/settings')}
                  className="ml-1 text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
                >
                  Settings
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-gray-400 text-sm mx-1">chevron_right</span>
                <span className="ml-1 text-xs font-medium text-primary font-bold">Edit Profile</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold text-[#111816] dark:text-white">
          Edit Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your personal details and account settings.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-red-500/50 hover:text-red-500 text-sm font-medium transition-colors shadow-sm"
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
              <span className="material-symbols-outlined text-[18px]">check</span>
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ProfileHeader


