import React from 'react'

const NewSlotCard = ({
  title = "New Slot",
  description = "Schedule a manual appointment",
  onClick,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-5 flex flex-col justify-center items-center text-center group hover:border-gray-300 dark:hover:border-gray-600 transition-colors ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-3 shadow-sm">
        <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-500">add</span>
      </div>
      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </button>
  )
}

export default NewSlotCard



