import React from 'react'

const StatsGrid = ({
  stats = [],
  className = ""
}) => {
  const defaultStats = [
    { value: "15k+", label: "Clients Served" },
    { value: "9", label: "Master Barbers" },
    { value: "4.9", label: "Average Rating" },
  ]

  const statsToDisplay = stats.length > 0 ? stats : defaultStats

  return (
    <div className={`grid grid-cols-3 gap-6 border-t border-gray-100 dark:border-gray-800 mt-4 ${className}`}>
      {statsToDisplay.map((stat, index) => (
        <div key={index}>
          <h3 className="text-3xl font-bold text-text-main dark:text-white">
            {stat.value}
          </h3>
          <p className="text-xs font-medium text-text-muted dark:text-gray-400 uppercase tracking-wide mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StatsGrid

