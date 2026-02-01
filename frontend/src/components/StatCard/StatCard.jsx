import React from 'react'

const StatCard = ({
  label,
  value,
  icon,
  color = "blue",
  progress = 0,
  description,
  className = "",
  onClick
}) => {
  const colorClasses = {
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      text: "text-yellow-600 dark:text-yellow-400",
      progress: "bg-yellow-500",
      value: "text-yellow-500 dark:text-yellow-400"
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-600 dark:text-indigo-400",
      progress: "bg-indigo-500",
      value: "text-indigo-500 dark:text-indigo-400"
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      progress: "bg-red-500",
      value: "text-red-500 dark:text-red-400"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
      progress: "bg-green-500",
      value: "text-green-500 dark:text-green-400"
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      progress: "bg-blue-500",
      value: "text-blue-500 dark:text-blue-400"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
      progress: "bg-purple-500",
      value: "text-purple-500 dark:text-purple-400"
    },
    pink: {
      bg: "bg-pink-50 dark:bg-pink-900/20",
      text: "text-pink-600 dark:text-pink-400",
      progress: "bg-pink-500",
      value: "text-pink-500 dark:text-pink-400"
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
      text: "text-cyan-600 dark:text-cyan-400",
      progress: "bg-cyan-500",
      value: "text-cyan-500 dark:text-cyan-400"
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-600 dark:text-orange-400",
      progress: "bg-orange-500",
      value: "text-orange-500 dark:text-orange-400"
    },
    teal: {
      bg: "bg-teal-50 dark:bg-teal-900/20",
      text: "text-teal-600 dark:text-teal-400",
      progress: "bg-teal-500",
      value: "text-teal-500 dark:text-teal-400"
    },
    gray: {
      bg: "bg-gray-50 dark:bg-gray-900/20",
      text: "text-gray-600 dark:text-gray-400",
      progress: "bg-gray-500",
      value: "text-gray-500 dark:text-gray-400"
    }
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div 
      className={`bg-white dark:bg-card-dark rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-700 transition-all ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <h3 className={`text-3xl font-bold ${colors.value} mt-1`}>
            {value}
          </h3>
        </div>
        {icon && (
          <span className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </span>
        )}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className={`${colors.progress} h-1.5 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {description && (
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      )}
    </div>
  )
}

export default StatCard
