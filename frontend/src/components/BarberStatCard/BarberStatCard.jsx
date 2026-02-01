import React from 'react'

const BarberStatCard = ({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  change,
  changeType = 'positive', // 'positive', 'negative', 'neutral'
  className = ""
}) => {
  const changeStyles = {
    positive: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    negative: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    neutral: 'text-gray-500 bg-gray-100 dark:bg-gray-800'
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${iconBg} ${iconColor} rounded-lg`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeStyles[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

export default BarberStatCard


