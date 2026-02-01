import React from 'react'

const SettingsSection = ({
  title,
  icon,
  children,
  className = ""
}) => {
  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {icon && (
            <span className="material-symbols-outlined text-gray-400">{icon}</span>
          )}
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export default SettingsSection


