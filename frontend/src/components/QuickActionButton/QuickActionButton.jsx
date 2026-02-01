import React from 'react'

const QuickActionButton = ({
  label,
  icon,
  color = "blue",
  onClick,
  className = ""
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      icon: "text-blue-500"
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      icon: "text-yellow-500"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/30",
      icon: "text-green-500"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/30",
      icon: "text-purple-500"
    }
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${className}`}
    >
      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
        <span className={`material-symbols-outlined ${colors.icon} text-xl`}>{icon}</span>
      </div>
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  )
}

export default QuickActionButton
