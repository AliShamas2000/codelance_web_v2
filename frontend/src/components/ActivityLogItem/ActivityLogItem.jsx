import React from 'react'

const ActivityLogItem = ({
  id,
  title,
  description,
  timestamp,
  type = "edit",
  className = ""
}) => {
  const typeConfig = {
    edit: {
      bg: "bg-blue-100 dark:bg-blue-900",
      icon: "edit",
      iconColor: "text-blue-600 dark:text-blue-300"
    },
    notification: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      icon: "notifications_active",
      iconColor: "text-yellow-600 dark:text-yellow-300"
    },
    add: {
      bg: "bg-green-100 dark:bg-green-900",
      icon: "add_circle",
      iconColor: "text-green-600 dark:text-green-300"
    },
    delete: {
      bg: "bg-red-100 dark:bg-red-900",
      icon: "delete",
      iconColor: "text-red-600 dark:text-red-300"
    }
  }

  const config = typeConfig[type] || typeConfig.edit

  return (
    <div className={`ml-6 relative ${className}`}>
      <span className={`absolute -left-9 flex items-center justify-center w-6 h-6 ${config.bg} rounded-full ring-4 ring-white dark:ring-gray-800`}>
        <span className={`material-symbols-outlined ${config.iconColor} text-xs`}>
          {config.icon}
        </span>
      </span>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      )}
      {timestamp && (
        <span className="text-xs text-gray-400 mt-1 block">{timestamp}</span>
      )}
    </div>
  )
}

export default ActivityLogItem
