import React from 'react'

const BarberAvailabilityCard = ({
  barberName,
  barberAvatar,
  availableSlots = [],
  isFull = false,
  className = ""
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        {barberAvatar ? (
          <img
            alt={barberName}
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-600 shadow-sm object-cover"
            src={barberAvatar}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
            {barberName.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-gray-900 dark:text-white">{barberName}</span>
        {isFull ? (
          <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
            Full
          </span>
        ) : (
          <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full font-bold">
            {availableSlots.length} {availableSlots.length === 1 ? 'slot' : 'slots'}
          </span>
        )}
      </div>
      {isFull ? (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 italic px-2 py-1.5">No available slots today</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-primary hover:text-primary dark:hover:border-white dark:hover:text-white text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BarberAvailabilityCard



