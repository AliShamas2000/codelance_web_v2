import React from 'react'

const TimeSlotColumn = ({
  timeSlots = [],
  className = ""
}) => {
  return (
    <div className={`w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 ${className}`}>
      {timeSlots.map((slot, index) => (
        <div
          key={index}
          className="h-20 border-b border-gray-100 dark:border-gray-800 relative"
        >
          <span className="absolute -bottom-2.5 right-2 text-xs font-medium text-gray-400">
            {slot.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default TimeSlotColumn


