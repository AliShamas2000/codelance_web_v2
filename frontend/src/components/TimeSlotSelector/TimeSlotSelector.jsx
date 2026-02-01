import React from 'react'

const TimeSlotSelector = ({
  timeSlots = [],
  selectedTime,
  onTimeSelect,
  unavailableSlots = [],
  columns = 2,
  className = ""
}) => {
  // Don't show default slots - only show slots from API when date is selected
  const slots = timeSlots || []

  const isUnavailable = (slot) => {
    return unavailableSlots.includes(slot)
  }

  const isSelected = (slot) => {
    return selectedTime === slot
  }

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <label className="text-sm font-medium text-text-main dark:text-gray-200 mb-3 block">
        Available Slots
      </label>
      {slots.length === 0 ? (
        <div className="p-4 border border-dashed border-gray-300 dark:border-white/20 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500">
          <div className="text-center">
            <span className="material-symbols-outlined text-[32px] mb-2 block">schedule</span>
            <p className="text-sm font-medium">Please select a date to see available time slots</p>
          </div>
        </div>
      ) : (
        <div className={`grid ${gridCols[columns] || gridCols[2]} gap-3 flex-1 content-start`}>
          {slots.map((slot, index) => {
            const unavailable = isUnavailable(slot)
            const selected = isSelected(slot)

            return (
              <button
                key={index}
                type="button"
                onClick={() => !unavailable && onTimeSelect && onTimeSelect(slot)}
                disabled={unavailable}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none ${
                  unavailable
                    ? 'border-dashed border-gray-300 dark:border-white/20 text-gray-400 dark:text-gray-500 cursor-not-allowed line-through'
                    : selected
                    ? 'bg-primary text-text-main border-primary shadow-md shadow-primary/20 transform scale-[1.02]'
                    : 'border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5 text-text-main dark:text-white'
                }`}
              >
                {slot}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TimeSlotSelector

