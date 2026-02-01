import React from 'react'
import HistoryItem from '../HistoryItem/HistoryItem'

const HistoryList = ({
  activities = [],
  onActivityClick,
  className = ""
}) => {
  if (activities.length === 0) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[500px] flex items-center justify-center ${className}`}>
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">history</span>
          <p className="text-gray-500 dark:text-gray-400">No activity found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[500px] flex flex-col ${className}`}>
      <div className="divide-y divide-gray-100 dark:divide-gray-800 flex-grow">
        {activities.map((activity) => (
          <HistoryItem
            key={activity.id}
            activity={activity}
            onClick={() => onActivityClick && onActivityClick(activity)}
          />
        ))}
      </div>
    </div>
  )
}

export default HistoryList


